import React, { useEffect, useState } from "react";
import styles from "./channel.module.css";
const Channel = () => {
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState(null);
  const userid = localStorage.getItem("userid");
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };
  useEffect(() => {
    console.log(channelName);
  }, [channelName]);
  useEffect(() => {
    console.log(description);
  }, [description]);
  useEffect(() => {
    console.log(avatar);
  }, [avatar]);
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create a FormData object
    const formData = new FormData();
    formData.append("userid", userid);
    formData.append("name", channelName);
    formData.append("description", description);
    formData.append("avatar", avatar); // Avatar file is added as FormData

    // Here, you can send formData to the backend using fetch or axios
    try {
      formData.forEach((item, key) => {
        console.log(`${key} ${item}`);
      });
      const response = await fetch("http://localhost:5000/createchannel", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("Server response:", result);
    } catch (error) {
      console.error("Error uploading channel data:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Create Your Channel</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="channelName">Channel Name</label>
          <input
            type="text"
            id="channelName"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            required
            placeholder="Enter channel name"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="avatar">Channel Avatar</label>
          <input
            type="file"
            id="avatar"
            accept="image/*"
            onChange={handleAvatarUpload}
            required
          />
          {avatar && <p>{avatar.name}</p>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Write a short description about your channel"
          ></textarea>
        </div>

        <button type="submit" className={styles.submitButton}>
          Create Channel
        </button>
      </form>
    </div>
  );
};

export default Channel;
