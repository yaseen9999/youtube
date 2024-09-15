import React, { useEffect } from "react";
import Sidebar from "../sidebar/sidebar.js";
import Videolisting from "../videolisting/videolist.js";
import styles from "./home.module.css";
import { useSelector, useDispatch } from "react-redux";
import socket from "../../config/socket.js";

const Home = () => {
  const show = useSelector((state) => state.sidebar.status);
  const dispatch = useDispatch();

  return (
    <div className={styles.container}>
      <Sidebar />
      <div className={`${styles.videolist} ${!show ? styles.grow : ""}`}>
        <Videolisting />
      </div>
    </div>
  );
};

export default Home;
