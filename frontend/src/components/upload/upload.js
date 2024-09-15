import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import styles from "./upload.module.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUploadStatus } from "../redux/uploadslice";
import socket from "../../config/socket.js";
const Upload = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    video: null,
    thumbnail: null,
  });
  const [progress, setProgress] = useState(0);
  // State to manage dialog visibility and progress
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);
  const uploadstatus = useSelector((state) => state.upload.status);

  const userid = localStorage.getItem("userid");
  useEffect(() => {
    console.log("Upload status:", uploadstatus);
    setIsDialogOpen(uploadstatus);
  }, [uploadstatus]);

  useEffect(() => {
    if (socket) {
      socket.on("progress", (data) => {
        if (typeof data === "number") {
          setProgress(data);
          console.log("Progress event received:", data);
        } else {
          console.warn("Invalid progress data received:", data);
        }

        if (data === 100) {
          setLoading(false); // Stop loading when complete
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("progress");
      }
    };
  }, [socket]);
  // Handle changes for input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle changes for file inputs
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files[0],
    }));
  };

  const handleUpload = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    if (formData.tags) {
      const tagsArray = formData.tags.split(",").map((tag) => tag.trim());
      formDataToSend.append("tags", JSON.stringify(tagsArray));
    }
    if (formData.video) {
      formDataToSend.append("video", formData.video);
    }
    if (formData.thumbnail) {
      formDataToSend.append("thumbnail", formData.thumbnail);
    }

    if (socket) {
      formDataToSend.append("socketid", socket.id); // Send the socket ID
    }
    if (userid) {
      formDataToSend.append("userid", userid); // Send the socket ID
    }
    setLoading(true); // Show progress bar

    try {
      await axios.post("http://localhost:5000/upload", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // Hide progress bar when upload is complete
    }
  };

  // Close the dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
    dispatch(setUploadStatus(false));
  };

  // Trigger file input click
  const handleIconClick = (ref) => {
    ref.current.click();
  };

  return (
    <>
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onClose={closeDialog}>
          <DialogTitle>Upload Video</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              name="name"
              fullWidth
              variant="standard"
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Description"
              type="text"
              name="description"
              fullWidth
              variant="standard"
              value={formData.description}
              onChange={handleInputChange}
            />
            <TextField
              margin="dense"
              label="Tags (comma separated)"
              type="text"
              name="tags" // Input for tags
              fullWidth
              variant="standard"
              placeholder="#example, #video, #tutorial" // Placeholder to guide user
              value={formData.tags}
              onChange={handleInputChange}
            />
            <FormControl fullWidth margin="normal">
              <div className={styles.flexContainer}>
                <div className={styles.flexContainer}>
                  <InputLabel htmlFor="thumbnail">Thumbnail</InputLabel>
                  <IconButton
                    onClick={() => handleIconClick(thumbnailInputRef)}
                  >
                    <AddIcon />
                  </IconButton>
                  <input
                    id="thumbnail"
                    type="file"
                    name="thumbnail"
                    ref={thumbnailInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <div className={styles.flexContainer}>
                <div>
                  <InputLabel htmlFor="video">Video</InputLabel>
                  <IconButton onClick={() => handleIconClick(videoInputRef)}>
                    <AddIcon />
                  </IconButton>
                  <input
                    id="video"
                    type="file"
                    name="video"
                    ref={videoInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </FormControl>
            {loading && (
              <div className={styles.progressContainer}>
                <LinearProgress variant="determinate" value={progress || 0} />
                <Typography variant="body2" color="textSecondary">{`${
                  progress || 0
                }%`}</Typography>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              color="primary"
              disabled={loading} // Disable button while loading
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default Upload;
