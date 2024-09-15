const ffmpeg = require("fluent-ffmpeg");
const path = require("path");
const fs = require("fs");
const { uploadToFirebase } = require("./uploadtofirebase");
const Video = require("../models/video");
const Channel = require("../models/channel");
ffmpeg.setFfmpegPath("C:\\Users\\yasin\\ffmpeg\\bin\\ffmpeg.exe");

const processVideo = (filePath, resolution, name, socketid, io) => {
  return new Promise((resolve, reject) => {
    console.log("socketid:", socketid);
    // console.log("io:", io);
    const sanitizedName = name.replace(/\s+/g, "_");
    const outputDir = path
      .join("uploads", sanitizedName, `${resolution}p`)
      .replace(/\\/g, "/");

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    let bitrate, maxrate, bufsize;
    switch (resolution) {
      case 240:
        bitrate = "200k";
        maxrate = "200k";
        bufsize = "400k";
        break;
      case 480:
        bitrate = "400k";
        maxrate = "400k";
        bufsize = "800k";
        break;
      case 720:
        bitrate = "800k";
        maxrate = "800k";
        bufsize = "1600k";
        break;
      case 1080:
        bitrate = "1500k";
        maxrate = "1500k";
        bufsize = "3000k";
        break;
      default:
        console.warn(
          `Unsupported resolution: ${resolution}. Using default settings.`
        );
    }

    ffmpeg(filePath)
      .outputOptions([
        `-vf scale=-2:${resolution}`,
        "-c:v libx264",
        "-c:a aac",
        `-b:v ${bitrate}`,
        `-maxrate ${maxrate}`,
        `-bufsize ${bufsize}`,
        "-b:a 128k",
        "-hls_time 5",
        "-hls_playlist_type vod",
        `-hls_segment_filename ${outputDir}/segment-%03d.ts`,
        "-hls_list_size 0",
        "-hls_flags independent_segments",
      ])
      .output(path.join(outputDir, `output-${resolution}p.m3u8`))
      .on("start", (commandLine) =>
        console.log("FFmpeg command: " + commandLine)
      )
      // .on("progress", (progress) => {
      //   const percentage = Math.floor(progress.percent); // Ensure percent is a valid number
      //   console.log("percentage emit", percentage);
      //   io.to(socketid).emit("progress", { percentage }); // Emit an object with percentage
      // })

      .on("end", async () => {
        const files = fs.readdirSync(outputDir);
        const segments = files
          .filter((file) => file.endsWith(".ts"))
          .map((file) => path.join(outputDir, file));

        const segmentUrls = await Promise.all(
          segments.map(async (segmentPath) => {
            const firebasePath = `${sanitizedName}/${resolution}p/${path.basename(
              segmentPath
            )}`;
            return await uploadToFirebase(segmentPath, firebasePath); // Ensure uploadToFirebase returns a URL
          })
        );

        const playlistPath = createM3U8Playlist(
          outputDir,
          resolution,
          segmentUrls
        );
        const playlistFirebaseUrl = await uploadToFirebase(
          playlistPath,
          `${sanitizedName}/${resolution}p/output-${resolution}p.m3u8`
        );

        resolve({ playlistPath, playlistFirebaseUrl, segmentUrls });
      })
      .on("error", (err) => reject(err))
      .run();
  });
};

const createM3U8Playlist = (outputDir, resolution, segmentUrls) => {
  const playlistPath = path.join(outputDir, `output-${resolution}p.m3u8`);
  const playlistContent = [
    "#EXTM3U",
    "#EXT-X-VERSION:6",
    "#EXT-X-TARGETDURATION:11",
    "#EXT-X-MEDIA-SEQUENCE:0",
    "#EXT-X-PLAYLIST-TYPE:VOD",
    "#EXT-X-INDEPENDENT-SEGMENTS",
    ...segmentUrls.map((url, index) => `#EXTINF:11.208333,\n${url}`),
    "#EXT-X-ENDLIST",
  ].join("\n");

  fs.writeFileSync(playlistPath, playlistContent);
  return playlistPath;
};
const createMasterPlaylist = (name, playlistUrls) => {
  const sanitizedName = name.replace(/\s+/g, "_");
  const outputDir = path.join("uploads", sanitizedName).replace(/\\/g, "/");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const masterPlaylistContent = [
    "#EXTM3U",
    "#EXT-X-VERSION:3",
    ...playlistUrls.map(
      ({ resolution, playlistUrl }) =>
        `#EXT-X-STREAM-INF:BANDWIDTH=${getBandwidthForResolution(
          resolution
        )},RESOLUTION=${resolution}\n${playlistUrl}`
    ),
  ].join("\n");

  const masterPlaylistPath = path.join(outputDir, "master.m3u8");
  fs.writeFileSync(masterPlaylistPath, masterPlaylistContent);

  return masterPlaylistPath;
};

const getBandwidthForResolution = (resolution) => {
  switch (resolution) {
    case 240:
      return 400000;
    case 480:
      return 800000;
    case 720:
      return 1600000;
    case 1080:
      return 3000000;
    default:
      return 1000000;
  }
};

exports.Upload = async (req, res, io) => {
  const filePath = req.files["video"] ? req.files["video"][0].path : null;
  const thumbnailFile = req.files["thumbnail"]
    ? req.files["thumbnail"][0].path
    : null;
  const { userid, socketid, name, description, tags } = req.body;
  const sanitizedName = name.replace(/\s+/g, "_"); // Sanitize the name here as well

  if (filePath) console.log(`Video File: ${filePath}`);
  if (thumbnailFile) console.log(`Thumbnail File: ${thumbnailFile}`);

  try {
    let progress = 0;
    let thumbnailUrl = "";
    if (thumbnailFile) {
      thumbnailUrl = await uploadToFirebase(
        thumbnailFile,
        `thumbnails/${sanitizedName}/${path.basename(thumbnailFile)}`
      );
    }
    progress += 10;
    io.to(socketid).emit("progress", progress);

    const fileUrls = [];
    const resolutions = [240, 480, 720, 1080];
    const resolutionCount = resolutions.length;

    for (const [index, res] of resolutions.entries()) {
      const { playlistPath, segmentUrls } = await processVideo(
        filePath,
        res,
        sanitizedName,
        socketid,
        io
      );
      const playlistUrl = await uploadToFirebase(
        playlistPath,
        `${sanitizedName}/${res}p/output-${res}p.m3u8`
      );

      fileUrls.push({
        resolution: `${res}p`,
        playlistUrl,
      });

      progress += Math.floor(70 / resolutionCount);
      io.to(socketid).emit("progress", progress);
    }
    const masterPlaylistPath = createMasterPlaylist(name, fileUrls);
    const masterPlaylistFirebaseUrl = await uploadToFirebase(
      masterPlaylistPath,
      `${sanitizedName}/master.m3u8`
    );

    progress += 10;
    io.to(socketid).emit("progress", progress);

    const newVideo = new Video({
      title: name,
      resolutions: fileUrls,
      tags: tags,
      masterPlaylistUrl: masterPlaylistFirebaseUrl,
      description,

      thumbnail: thumbnailUrl,
    });

    const channel = await Channel.findOne({ userid });
    if (!channel) {
      return res.status(404).send("Channel not found");
    }

    channel.videos.push(newVideo._id);
    newVideo.channelId = channel._id;
    await channel.save();
    await newVideo.save();
    progress = 100;
    io.to(socketid).emit("progress", progress);

    res.status(200).send("Files processed and metadata saved successfully");
  } catch (err) {
    console.error("Error processing video:", err);
    res.status(500).send("Error processing video");
  }
};
