import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./navbar.module.css";
import youtubelogo from "./youtubelogo.png";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search"; // Import the search icon
import { useDispatch } from "react-redux";
import { setsearchquery } from "../redux/searchslice";
import { setUploadStatus } from "../redux/uploadslice";
import { setsidebarstatus } from "../redux/sidebarslice";
import { clearUserid } from "../redux/userslice";
import { useSelector } from "react-redux";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  const [search, setsearch] = useState("");
  const sidebarstatus = useSelector((state) => state.sidebar.status);
  const searchvalue = useSelector((state) => state.search.search);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let isLoggedIn = useSelector((state) => state.user.userid);

  const handlequery = (event) => {
    const search = event.target.value;
    setsearch(search);
  };
  const handlesearch = () => {
    dispatch(setsearchquery(search));
    setsearch("");
  };
  const handleuploadstatus = () => {
    console.log("status uplaod click");

    dispatch(setUploadStatus(true));
  };
  const handleshow = () => {
    console.log("sidebar status  click");
    dispatch(setsidebarstatus(!sidebarstatus));
  };
  const handlelogout = () => {
    console.log("logout click");
    localStorage.removeItem("userid");
    dispatch(clearUserid(null));
  };
  const handlechannel = () => {
    console.log("channel click");

    navigate("/createchannel");
  };
  useEffect(() => {
    console.log(search);
  }, [search]);
  useEffect(() => {
    console.log(searchvalue);
  }, [searchvalue]);
  useEffect(() => {
    console.log("sidebar", sidebarstatus);
  }, [sidebarstatus]);
  return (
    <nav className={styles.navbar}>
      <MenuIcon onClick={() => handleshow()} className={styles.menu} />
      <div className={styles.navbar__logo}>
        <Link to="/">
          <img src={youtubelogo} alt="YouTube" className={styles.logoImage} />
        </Link>
      </div>
      <div className={styles.navbar__searchContainer}>
        <input
          type="text"
          placeholder="Search"
          className={styles.searchInput}
          onChange={handlequery}
        />

        <SearchIcon
          onClick={() => handlesearch()}
          className={styles.searchIcon}
        />
      </div>
      <div className={styles.navbar__links}>
        {isLoggedIn ? (
          <>
            <div className={styles.notificationIcon}>
              <NotificationsIcon />
            </div>
            <div>
              <div className={styles.upload}>
                <p onClick={() => handleuploadstatus()}>Upload</p>
              </div>
            </div>

            <p className={styles.logout} onClick={() => handlelogout()}>
              Logout
            </p>

            <p className={styles.logout} onClick={() => handlechannel()}>
              CreateChannel
            </p>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
