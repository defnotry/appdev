import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarHeader,
  CDBSidebarMenuItem,
} from "cdbreact";
import logo from "../../assets/images/youtify.png";
import "../../css/sections/sidebar.css";
import { Col, Nav, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCompactDisc,
  faFileAlt,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
import BACKEND_URL from "../../config";

function UserSidebar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userVerified, setUserVerified] = useState(false);
  const [userArtist, setUserArtist] = useState(false);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.get(`${BACKEND_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data;
      setUser(userData.data);
      setUserArtist(userData.role === "artist");
    } catch (error) {
      console.error("Failed to get user details:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate("/login");
    } else {
      fetchUserDetails();
    }
  });

  return (
    <>
      <CDBSidebar
        textColor="#fff"
        backgroundColor="#101011"
        className="text-white sb-bg"
      >
        <div className="p-3">
          <img src={logo} alt="YOUTIFY" />
        </div>
        <CDBSidebarHeader className="d-flex justify-content-center">
          <a
            href="/home"
            className="text-decoration-none text-white bg-dark rounded p-2"
          >
            {user ? user.name : "Loading..."}
          </a>
        </CDBSidebarHeader>
        <Col className="flex-grow-1 d-flex flex-column vh-100">
          <Row className="align-items-start">
            <CDBSidebarContent className="sidebar-content">
              <nav id="sidebar">
                <NavLink
                  to="/home"
                  activeclassname="activeClicked"
                  className="navitem"
                >
                  <CDBSidebarMenuItem icon="home">Home</CDBSidebarMenuItem>
                </NavLink>
                <NavLink
                  to="/search"
                  activeclassname="activeClicked"
                  className="navitem"
                >
                  <CDBSidebarMenuItem icon="search">Search</CDBSidebarMenuItem>
                </NavLink>
                <NavLink
                  to="/music"
                  activeclassname="activeClicked"
                  className="navitem"
                >
                  <CDBSidebarMenuItem icon="music">Music</CDBSidebarMenuItem>
                </NavLink>
                <NavLink
                  to="/podcast"
                  activeclassname="activeClicked"
                  className="navitem"
                >
                  <CDBSidebarMenuItem icon="podcast">
                    Podcast
                  </CDBSidebarMenuItem>
                </NavLink>
                <NavLink
                  to="/videocast"
                  activeclassname="activeClicked"
                  className="navitem"
                >
                  <CDBSidebarMenuItem icon="video">
                    Videocast
                  </CDBSidebarMenuItem>
                </NavLink>
              </nav>
              <p className="sb-lib">YOUR LIBRARY</p>
              <nav id="sidebar">
                <NavLink
                  to="#"
                  activeclassname="activeClicked"
                  className="navitem"
                >
                  <CDBSidebarMenuItem>
                    <FontAwesomeIcon
                      icon={faCompactDisc}
                      className="menu-icon"
                    />
                    Recently Played
                  </CDBSidebarMenuItem>
                </NavLink>
                <NavLink
                  to="#"
                  activeclassname="activeClicked"
                  className="navitem"
                >
                  <CDBSidebarMenuItem>
                    <FontAwesomeIcon
                      icon={faCompactDisc}
                      className="menu-icon"
                    />
                    Top Charts
                  </CDBSidebarMenuItem>
                </NavLink>
                <NavLink
                  to="#"
                  activeclassname="activeClicked"
                  className="navitem"
                >
                  <CDBSidebarMenuItem>
                    <FontAwesomeIcon
                      icon={faCompactDisc}
                      className="menu-icon"
                    />
                    Best of the Best
                  </CDBSidebarMenuItem>
                </NavLink>
              </nav>
              {userArtist && (
                <>
                  <p className="sb-lib">
                    <span>
                      <FontAwesomeIcon
                        icon={faChartLine}
                        className="menu-icon"
                      />
                    </span>
                    Dashboard
                  </p>
                  <nav id="sidebar">
                    <NavLink
                      to="/artist/dashboard/upload"
                      activeclassname="activeclassname"
                      className="navitem"
                    >
                      <CDBSidebarMenuItem>
                        <FontAwesomeIcon
                          icon={faFileAlt}
                          className="menu-icon"
                        />
                        Your Content
                      </CDBSidebarMenuItem>
                    </NavLink>
                  </nav>
                </>
              )}
            </CDBSidebarContent>
          </Row>
        </Col>
      </CDBSidebar>
    </>
  );
}

export default UserSidebar;
