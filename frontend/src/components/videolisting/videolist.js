import React, { useEffect, useState } from "react";
import axios from "axios";
import style from "./videolist.module.css";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const Videolisting = () => {
  const [videos, setVideos] = useState([]);
  const navigate = useNavigate();
  const searchvalue = useSelector((state) => state.search.search);
  useEffect(() => {
    const searchVideos = () => {
      if (searchvalue) {
        console.log(searchvalue);

        const searchWords = searchvalue.toLowerCase().split(" "); // split return array
        console.log(searchWords);

        const filteredVideos = videos.filter((item) => {
          const titleWords = item.title.toLowerCase().split(" ");
          console.log("title words ", titleWords);
          return searchWords.some((word) => titleWords.includes(word));
        });
        console.log("filteredvideo", filteredVideos);

        setVideos(filteredVideos);
      }
    };

    searchVideos();
  }, [searchvalue]);
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get("http://localhost:5000/allvideos");
        setVideos(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchVideos();
  }, []);

  useEffect(() => {
    const updateRelativeTimes = () => {
      setVideos((prevVideos) =>
        prevVideos.map((video) => ({
          ...video,
          relativeTime: formatDistanceToNow(parseISO(video.uploadDate), {
            addSuffix: true,
          }),
        }))
      );
    };

    // Initial update
    updateRelativeTimes();

    // Update every minute
    const intervalId = setInterval(updateRelativeTimes, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleCardClick = (id) => {
    navigate(`/detailpage/${id}`);
  };

  return (
    <div className={style.container}>
      <Row>
        {videos.length > 0 ? (
          videos.map((item) => (
            <Col key={item._id} xs={12} sm={6} md={6} lg={4} className="mb-4">
              <Card
                className={style.card}
                sx={{ maxWidth: 345 }}
                onClick={() => handleCardClick(item._id)}
              >
                <CardMedia
                  className={style.cardmedia}
                  sx={{ height: 180 }}
                  image={item.thumbnail}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.title}
                  </Typography>
                  <div className={style.cardcontent}>
                    <Typography gutterBottom variant="body2" component="div">
                      {item.views}views
                    </Typography>
                    <Typography gutterBottom variant="body2" component="div">
                      {item.relativeTime}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Col>
          ))
        ) : (
          <p>No videos available</p>
        )}
      </Row>
    </div>
  );
};

export default Videolisting;
