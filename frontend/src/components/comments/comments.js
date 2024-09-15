import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./comments.module.css";
import { Avatar, IconButton, TextField, Button } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReplyIcon from "@mui/icons-material/Reply";
const Comments = ({ id }) => {
  const [comments, setcomment] = useState([]);
  const [newcomment, setnewcomment] = useState("");
  useEffect(() => {
    console.log("id in comments ", id);
  }, [id]);
  useEffect(() => {
    const getcomments = async () => {
      const response = await axios.get(
        `http://localhost:5000/getcomments/${id}`
      );
      setcomment(response.data);
    };
    getcomments();
  }, []);
  useEffect(() => {
    console.log(comments);
  }, [comments]);
  useEffect(() => {
    console.log(newcomment);
  }, [newcomment]);
  const userid = localStorage.getItem("userid");
  console.log("user id in commnets ", userid);
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    console.log("calling api ");
    const response = await axios.post(
      `http://localhost:5000/addcomment/${id}`,
      {
        newcomment,
        userid,
      }
    );
    console.log(response.data);
    setcomment((preV) => [...preV, response.data]);
  };

  return (
    <div className={styles.commentsSection}>
      <h3 className={styles.commentsTitle}>Comments</h3>

      <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
        <TextField
          className={styles.commentInput}
          label="Add a comment..."
          variant="outlined"
          value={newcomment}
          onChange={(e) => setnewcomment(e.target.value)}
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={styles.submitBtn}
        >
          Comment
        </Button>
      </form>

      {comments &&
        comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <Avatar
              src={comment.userid.profilePicture}
              className={styles.avatar}
            />
            <div className={styles.commentBody}>
              <div className={styles.commentHeader}>
                <span className={styles.username}>{comment.userid.email}</span>
                <span className={styles.date}>{comment.date}</span>
              </div>
              <p className={styles.commentText}>{comment.comment}</p>
              <div className={styles.commentActions}>
                <IconButton className={styles.actionBtn}>
                  <ThumbUpIcon fontSize="small" />
                  <span className={styles.actionText}>{comment.likes}</span>
                </IconButton>
                <IconButton className={styles.actionBtn}>
                  <ThumbDownIcon fontSize="small" />
                </IconButton>
                <IconButton className={styles.actionBtn}>
                  <ReplyIcon fontSize="small" />
                  <span className={styles.actionText}>Reply</span>
                </IconButton>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Comments;
