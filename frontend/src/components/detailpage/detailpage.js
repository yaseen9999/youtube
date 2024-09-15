import React from "react";
import VideoPage from "../videoplayer/videoplayer";
import styles from "./detailpage.module.css";
import { useParams } from "react-router-dom";
import RelatedContent from "../relatedvideos/relatedvideos";
const Detailpage = () => {
  const { id } = useParams();
  return (
    <div className={styles.Container}>
      <div className={styles.content1}>
        <VideoPage id={id} />
      </div>
      <div className={styles.content2}>
        <RelatedContent id={id} />
      </div>
    </div>
  );
};

export default Detailpage;
