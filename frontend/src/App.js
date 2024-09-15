import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Upload from "./components/upload/upload";
import VideoPlayer from "./components/videoplayer/videoplayer";
import Home from "./components/homepage/home";
import Navbar from "./components/navbar/navbar";
import SignIn from "./components/login/login";
import SignUp from "./components/signup/signup";
import Channel from "./components/channel/channel";
import "bootstrap/dist/css/bootstrap.min.css";
import Detailpage from "./components/detailpage/detailpage";
import RelatedContent from "./components/relatedvideos/relatedvideos";
function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Upload />

        <Routes>
          <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/detailpage/:id" element={<Detailpage />} />
          <Route path="/" element={<Home />} />
          <Route path="/createchannel" element={<Channel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
