const Video = require("../models/video");
exports.relatedcontent = async (req, res) => {
  try {
    console.log("api call for related content video");
    const { id } = req.params;
    console.log(id);
    const video = await Video.findById({ _id: id });
    console.log("video for  finding its related content ", video);
    let processedtags;
    if (video) {
      const tags = video.tags;
      console.log("Original video tags ", tags);
      processedtags = tags
        .map((tag) => {
          return tag
            .replace(/[^\w\s#]/g, "") // Remove brackets and quotes
            .split("#") // Split by hashtag to get individual words
            .filter(Boolean); // Remove any empty strings
        })
        .flat();
      console.log(processedtags);
      const allvideos = await Video.find({ _id: { $ne: id } });

      const relatedVideos = allvideos.filter((item) => {
        // Process tags for comparison
        const itemTags = item.tags
          .map((tag) =>
            tag
              .replace(/['\[\]#]/g, "")
              .split(",")
              .map((tag) => tag.trim())
              .filter(Boolean)
          )
          .flat();

        return itemTags.some((tag) => processedtags.includes(tag));
      });
      console.log("Related videos: ", relatedVideos);

      res.status(200).json(relatedVideos);
    }
  } catch (error) {
    console.log("error in related content ", error);
  }
};
