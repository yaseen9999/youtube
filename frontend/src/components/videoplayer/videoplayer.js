import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import ReactPlayer from "react-player";
import { IconButton, Menu, MenuItem } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import Comments from "../comments/comments";
import Videodetails from "./videodetails";
const VideoPage = ({ id }) => {
  const [videoData, setVideoData] = useState(null);
  const [qualityData, setQualityData] = useState(null);
  const [error, setError] = useState(null);
  const [quality, setQuality] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  useEffect(() => {
    console.log("id in video data ", id);
  }, [id]);
  useEffect(() => {
    console.log("videodata", videoData);
  }, [videoData]);
  useEffect(() => {
    console.log("Component mounted or id changed:", id);

    return () => {
      console.log("Component unmounted or id changed");
    };
  }, [id]);
  useEffect(() => {
    let isMounted = true;

    const fetchVideoData = async () => {
      try {
        const response = await axios.post(`http://localhost:5000/videos/${id}`);
        if (isMounted) {
          setVideoData(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setError("Error fetching video data.");
        }
        console.error("Error fetching video data:", error);
      }
    };

    fetchVideoData();

    return () => {
      isMounted = false; // cleanup
    };
  }, [id]);

  useEffect(() => {
    let isMounted = true; // track if the component is mounted

    const fetchQualityData = async () => {
      try {
        const response = await axios.post(
          `http://localhost:5000/quality/${id}`
        );
        if (isMounted) {
          setQualityData(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setError("Error fetching quality data.");
        }
        console.error("Error fetching quality data:", error);
      }
    };

    fetchQualityData();

    return () => {
      isMounted = false; // cleanup
    };
  }, [id]);
  const playlistUrl = qualityData
    ? qualityData.resolutions.find((item) => item.resolution === quality)
        ?.playlistUrl
    : null;

  const videoUrl = useMemo(() => {
    return quality ? playlistUrl : videoData?.masterPlaylistUrl;
  }, [quality, playlistUrl, videoData?.masterPlaylistUrl]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleQualityChange = (newQuality) => {
    setQuality(newQuality);
    handleClose();
  };

  if (error) {
    return <p>{error}</p>;
  }
  if (!videoData || !videoData.masterPlaylistUrl) {
    return <p>No video data available.</p>;
  }

  const qualityOptions = ["240p", "420p", "720p", "1080p"];

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          position: "relative",
          borderRadius: "15px", // Apply rounded corners to the video itself
          overflow: "hidden", // Prevent content from spilling outside the rounded area
        }}
      >
        <ReactPlayer
          key={videoUrl}
          url={videoUrl}
          playing={true}
          controls={true}
          width="100%"
          height="auto"
        />

        <IconButton
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            zIndex: 10,
            color: "white",
          }}
          onClick={handleClick}
        >
          <SettingsIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {qualityOptions.map((option) => (
            <MenuItem key={option} onClick={() => handleQualityChange(option)}>
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
      <div>
        <Videodetails videoData={videoData} />
      </div>
      <div>
        <Comments id={id} />
      </div>
    </div>
  );
};

export default VideoPage;
