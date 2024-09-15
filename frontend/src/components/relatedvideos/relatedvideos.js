import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import axios from "axios";
import "./relatedvideos.css";
import { useNavigate } from "react-router-dom";
const RelatedContent = ({ id }) => {
  const [relatedContent, setRelatedContent] = useState([]);
  useEffect(() => {
    console.log(relatedContent);
  }, [relatedContent]);
  const navigate = useNavigate();
  useEffect(() => {
    const relatedcontent = async () => {
      const res = await axios.post(
        `http://localhost:5000/relatedcontent/${id}`
      );
      console.log("related videos ", res.data);
      setRelatedContent(res.data);
    };
    relatedcontent();
  }, [id]);
  const handlerelatedvideo = (id) => {
    console.log("item click ", id);
    navigate(`/detailpage/${id}`);
  };
  return (
    <div className="container">
      <div className="row">
        {relatedContent ? (
          relatedContent.map((item) => (
            <div
              onClick={() => handlerelatedvideo(item._id)}
              key={item.id}
              className="col-12 mb-2"
            >
              <div className="card">
                <div className="row no-gutters">
                  <div className="col-md-6">
                    <img
                      src={item.thumbnail}
                      className="card-img"
                      alt={item.title}
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="card-body">
                      <h6 className="card-title">{item.title}</h6>

                      <p className="card-text">
                        <small className="text-muted">
                          Views: {item.views}
                        </small>
                      </p>
                      <p className="card-text">
                        <small className="text-muted">
                          Uploaded:{" "}
                          {new Date(item.uploadDate).toLocaleDateString()}
                        </small>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Loading</div>
        )}
      </div>
    </div>
  );
};

export default RelatedContent;
