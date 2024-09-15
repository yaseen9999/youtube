import React from "react";
import styles from "./sidebar.module.css";
import HomeIcon from "@mui/icons-material/Home";
import ExploreIcon from "@mui/icons-material/Explore";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import HistoryIcon from "@mui/icons-material/History";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setsidebarstatus } from "../redux/sidebarslice";

const Sidebar = () => {
  const show = useSelector((state) => state.sidebar.status);
  const dispatch = useDispatch();

  const handleToggleSidebar = () => {
    dispatch(setsidebarstatus(!show));
  };

  return (
    <>
      <div className={`${styles.sidebar} ${show ? styles.show : ""}`}>
        <div className={styles["sidebar-item"]}>
          <HomeIcon className={styles["sidebar-icon"]} />
          <span className={styles["sidebar-text"]}>Home</span>
        </div>
        <div className={styles["sidebar-item"]}>
          <ExploreIcon className={styles["sidebar-icon"]} />
          <span className={styles["sidebar-text"]}>Explore</span>
        </div>
        <div className={styles["sidebar-item"]}>
          <SubscriptionsIcon className={styles["sidebar-icon"]} />
          <span className={styles["sidebar-text"]}>Subscriptions</span>
        </div>
        <div className={styles["sidebar-item"]}>
          <VideoLibraryIcon className={styles["sidebar-icon"]} />
          <span className={styles["sidebar-text"]}>Library</span>
        </div>
        <div className={styles["sidebar-item"]}>
          <HistoryIcon className={styles["sidebar-icon"]} />
          <span className={styles["sidebar-text"]}>History</span>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
