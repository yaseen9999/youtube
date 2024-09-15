import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import Button from "@mui/material/Button";
import styles from "./videoplayer.module.css";
import SaveIcon from "@mui/icons-material/Save";
import { useParams } from "react-router-dom";
import socket from "../../config/socket";
import axios from "axios";
const Videodetails = ({ videoData }) => {
  const { id } = useParams();
  const [liked, setLiked] = useState(null);
  const [dislike, setdisLiked] = useState(null);
  const [save, setsave] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [likes, setlikes] = useState(0);
  const [dislikes, setdislikes] = useState(0);
  const [message, setmessage] = useState(0);
  const [subscribers, setsubscriber] = useState(0);
  const [showupdatedsubscribers, setupdatedsubscriber] = useState(null);
  const userid = localStorage.getItem("userid");
  useEffect(() => {
    if (socket && socket.id) {
      console.log(" SOCKET ID ", socket.id);
    } else {
      console.log("Socket not available");
    }
  }, [socket]);
  useEffect(() => {
    console.log("save message is ", message);
  }, [message]);
  useEffect(() => {
    if (videoData) {
      setlikes(videoData.likes);
      setdislikes(videoData.dislikes);
      setsubscriber(videoData.channelId.subscribers);
    }
  }, []);

  useEffect(() => {
    const updateLikes = async () => {
      if (liked === 1) {
        await axios.post(`http://localhost:5000/like/${id}`);
      } else if (liked === 0) {
        console.log("api call for undolike");
        await axios.post(`http://localhost:5000/undolike/${id}`);
      }
    };

    // Only update likes if `liked` is not `null`
    if (liked !== null) {
      updateLikes();
    }
  }, [liked, id]); // Dependency array only includes `liked` and `id`

  useEffect(() => {
    const updateDislikes = async () => {
      if (dislike === 1) {
        await axios.post(`http://localhost:5000/dislike/${id}`);
      } else if (dislike === 0) {
        console.log("api call for undodislike");
        await axios.post(`http://localhost:5000/undodislike/${id}`);
      }
    };

    // Only update dislikes if `dislike` is not `null`
    if (dislike !== null) {
      updateDislikes();
    }
  }, [dislike, id]); // Dependency array only includes `dislike` and `id`

  useEffect(() => {
    const handleLikeUpdate = (data) => {
      console.log("listen to like update");
      if (data.videoId === videoData._id) {
        setlikes(data.likes);
      }
    };

    const handleDislikeUpdate = (data) => {
      console.log("listen to dislike update");
      if (data.videoId === videoData._id) {
        setdislikes(data.dislikes);
      }
    };

    const handleSubscribersUpdate = (data) => {
      console.log("listen to subscribe update");
      if (data.videoId === videoData._id) {
        setsubscriber(data.updatedsubscriber);
      }
    };
    const handlewatchlater = (data) => {
      console.log("listen to save event");
      if (data) {
        setmessage(data.message);
      }
    };
    socket.on("likeupdate", handleLikeUpdate);
    socket.on("dislikeupdate", handleDislikeUpdate);
    socket.on("updatedsubscribers", handleSubscribersUpdate);
    socket.on("save", handlewatchlater);
    // Cleanup socket listeners on unmount
    return () => {
      socket.off("likeupdate", handleLikeUpdate);
      socket.off("dislikeupdate", handleDislikeUpdate);
      socket.off("updatedsubscribers", handleSubscribersUpdate);
    };
  }, [videoData._id]);
  useEffect(() => {
    const subscribe = async () => {
      await axios.post(`http://localhost:5000/subscribe/`, { id, userid });
    };

    if (showupdatedsubscribers == 1) subscribe();
  }, [showupdatedsubscribers]);
  useEffect(() => {
    const unsubscribe = async () => {
      await axios.post(`http://localhost:5000/unsubscribe/`, { id, userid });
    };
    if (showupdatedsubscribers == 0) unsubscribe();
  }, [showupdatedsubscribers]);
  const handleLikeClick = async () => {
    const newLikedState = liked === 1 ? 0 : 1;
    setLiked(newLikedState);
  };
  const handledislikeClick = async () => {
    const newDislikeState = dislike === 1 ? 0 : 1;
    setdisLiked(newDislikeState);
  };
  const toggleExpand = async () => {
    setIsExpanded(!isExpanded);
  };
  const handleSubscribe = async () => {
    console.log("subscribe button click");
    const newSubscribestate = showupdatedsubscribers === 1 ? 0 : 1;

    setupdatedsubscriber(newSubscribestate);
  };
  const handlesave = async () => {
    console.log("save button click");
    setsave(!save);
    const res = axios.post(`http://localhost:5000/save/${id}`, {
      userid,
    });
    setTimeout(() => {
      setmessage(null);
    }, 5000);
  };

  return (
    <div className={styles.videodetails}>
      <div className={styles.title}>{videoData.title}</div>
      <div className={styles.content1}>
        <div>
          <Avatar alt="channel avatar" src={videoData.channelId.avatar} />
        </div>
        <div className={styles.content2}>
          <div className={styles.channelname}>{videoData.channelId.name}</div>

          <div className={styles.subscribe}>{subscribers}subscribers</div>
        </div>
        <Button
          variant="contained"
          sx={{
            borderRadius: 8,
            backgroundColor: "darkred",
            width: 100,
            height: 36,
            "&:hover": {
              backgroundColor: "red", // Optional: changes the color when hovered
            },
          }}
          onClick={() => handleSubscribe()}
        >
          {showupdatedsubscribers ? "Subcribed" : "Subscribe"}
        </Button>
        <div className={styles.like}>
          <Button
            variant="contained"
            startIcon={liked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
            onClick={() => handleLikeClick()}
            sx={{
              width: 100,
              height: 36,
              borderRadius: 8,
              backgroundColor: "#202020",
              "&:hover": {
                backgroundColor: "black", // Optional: changes the color when hovered
              },
            }}
          >
            {likes}
          </Button>
        </div>

        <div className={styles.like}>
          <Button
            variant="contained"
            sx={{
              width: 100,
              height: 36,
              borderRadius: 8,
              backgroundColor: "#202020",
              "&:hover": {
                backgroundColor: "black", // Optional: changes the color when hovered
              },
            }}
            startIcon={dislike ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
            onClick={() => handledislikeClick()} // Rounded corners
          >
            {dislikes}
          </Button>
        </div>

        <div className={styles.save}>
          <Button
            variant="contained"
            sx={{
              width: 100,
              height: 36,
              borderRadius: 8,
              backgroundColor: "#202020",
              "&:hover": {
                backgroundColor: "black", // Optional: changes the color when hovered
              },
            }}
            startIcon={<SaveIcon />}
            onClick={() => handlesave()} // Rounded corners
          >
            {save ? "Saved" : "Save"}
          </Button>
        </div>
        {message && <div className={styles.message}>{message}</div>}
      </div>
      <div>
        <div
          className={`${styles.description} ${
            isExpanded ? styles.expanded : ""
          }`}
        >
          <div>
            <p>{videoData.views}&nbsp;views</p>
          </div>
          <div>
            <p className={styles.descriptionText}>
              {isExpanded
                ? videoData.description
                : `${videoData.description.slice(0, 100)}...`}{" "}
            </p>

            <span className={styles.showMore} onClick={toggleExpand}>
              {isExpanded ? "Show Less" : "Show More"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videodetails;
