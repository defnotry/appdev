import React, { useState, useEffect, useRef, CSSProperties } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button, Container, Row, Col, Image, Stack } from "react-bootstrap";
import axios from "axios";
import Modal from 'react-bootstrap/Modal';
import BACKEND_URL from "../config";
import UserSidebar from "./UserSidebar";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SyncLoader } from "react-spinners"

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const ArtistPage = () => {
  let [loading, setLoading] = useState(true);
  let [color, setColor] = useState("#ffffff");

  const [isVerified, setIsVerified] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [logoutDisabled, setLogoutDisabled] = useState(false);

  const [artist, setArtist] = useState(null);
  const { id } = useParams();

  // Player
  const [currentSong, setCurrentSong] = useState(null);
  const [currentSongName, setCurrentSongName] = useState(null);
  const playerRef = useRef();

  // SONGS
  const [songs, setSongs] = useState([]);

  // MODAL
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (!token) {
      navigate('/login');
    } else {
      fetchUserDetails(); // Call fetchUserDetails directly
    }
  
    axios.get(`${BACKEND_URL}/artists/${id}`)
      .then(response => {
        setArtist(response.data);
      }).catch(error => {
        console.error('There was an error!', error);
      });
  
  
      axios.get(`http://localhost/api/songs/${id}`)
      .then(response => {
        console.log('Songs data:', response.data); // Add this console log
        console.log(response);
        setSongs(response.data);
      })
      .catch(error => {
        console.error('Error fetching songs:', error);
      });
  
  }, [id, isVerified]);
  

  const navigate = useNavigate();

  const buttonStyle = {
    marginTop: "30px",
    fontSize: "150%",
    borderRadius: "20px",
    width: "100%",
    height: "50px",
    marginBottom: "10px",
    backgroundColor: "transparent",
    borderColor: "#8d4b4b",
    color: "#ff3535",
    transition: "background-color 0.3s, color 0.3s, transform 0.3",
  };

  const handleMouseEnter = (e) => {
    e.target.style.backgroundColor = "red";
    e.target.style.color = "white";
    e.target.style.borderColor = "#8d4b4b";
  };

  const handleMouseLeave = (e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = "#ff3535";
    e.target.style.borderColor = "#8d4b4b";
  };



  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      const response = await axios.get(`${BACKEND_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data; // Assuming user details are directly in response.data
      console.log(userData);
      setIsVerified(userData.email_verified_at !== null);
      if (userData.email_verified_at === null) {
        handleShow();
      }

      // Check if the user has admin or superadmin role
      const isAdmin = userData.role.includes('admin');
      const isSuperAdmin = userData.role.includes('superadmin');
      if (isAdmin || isSuperAdmin) {
        navigate('/admin');
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      localStorage.removeItem("jwt_token");
    }
  };

  const handleSendVerify = async (e) => {
    e.preventDefault();
    setIsButtonDisabled(true); // disable the button
    setRemainingTime(180); // set remaining time to 3 minutes
    const timerId = setInterval(() => {
      setRemainingTime((time) => time - 1);
    }, 1000);
    setTimeout(() => {
      setIsButtonDisabled(false); // enable the button after 3 minutes
      clearInterval(timerId); // clear the interval
    }, 3 * 60 * 1000);
    try {
      const token = localStorage.getItem("jwt_token");
      const userDetailsResponse = await axios.get(`${BACKEND_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const user = userDetailsResponse.data;
      const response = await axios.post(
        `${BACKEND_URL}/resend-verification-email`,
        {
          name: user.name, // use the name from the user's details
          email: user.email, // use the email from the user's details
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (setShow) {
        handleClose();
      }
      console.log(response.data);
    } catch (error) {
      console.error("Email sending failed:", error);
    }
  };



  return (
    <>
      <div className="home-page d-flex vh-100">
        <UserSidebar />
        <Modal show={show} onHide={handleClose} backdrop="static"
          aria-labelledby="contained-modal-title-vcenter"
          centered>
          <Modal.Header closeButton>
            <Modal.Title>Email Verification Required</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              We noticed that your email address has not been verified yet.
              To ensure the security of your account and to gain full access
              to all features of our application, it's important to verify your
              email address. We kindly request you to check your email for the verification link.
            </p></Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Ok
            </Button>
          </Modal.Footer>
        </Modal>
        <Container className="home-page-content" fluid>
          <Row className="vh-100 overflow-hidden">
            <Col className="p-5 vh-100 overflow-auto mb-5 custom-scrollbar">
              <Row className="mb-5">
                <Form.Control className="search-bar" placeholder="Search" />
              </Row>
              <h1 className="home-page-text mb-5">
                {artist ? artist.name : 'Loading...'}
              </h1>
              <p className="home-page-text">
                NEW RELEASES
              </p>


              <Stack direction="vertical" className="song-item-container p-3 mb-5" gap={1}>
                {songs.length === 0 ? (
                  <div className="home-page-text">This artist doesn't have songs yet :((</div>
                ) : (
                  songs.map((song, index) => (
                    <Row key={index} className="song-item p-3" onClick={() => {
                      const songUrl = `${BACKEND_URL}/play/${song.hashed_name}`;
                      fetch(songUrl)
                        .then(response => response.blob())
                        .then(blob => {
                          const audioBlobURL = URL.createObjectURL(blob);
                          setCurrentSong(audioBlobURL);
                          setCurrentSongName(song.display_name);
                        });
                    }}>
                      <Col xs={1}>
                        {index + 1}
                      </Col>
                      <Col>
                        {song.display_name}
                      </Col>
                    </Row>
                  ))
                )}
              </Stack>

            </Col>
            <Col xs={4} className="right-sidebar">
              <Row className="p-5">
                <Col>
                  <div className="text-center text-white">
                    <h1 style={{ marginTop: "30px" }}>
                      Welcome to
                      <span
                        style={{
                          marginLeft: "10px",
                          color: "red",
                          transition: "color 0.3s",
                          cursor: "text"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.color = "red";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "white";
                        }}
                      >
                        MEDIAHARBOR
                      </span>
                    </h1>
                  </div>

                  {/* IF NOT VERIFIED */}
                  {!isVerified ? (
                    <>
                      <Button
                        variant="primary"
                        className="login-button btn-block"
                        style={buttonStyle}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        onClick={handleSendVerify}
                        disabled={isButtonDisabled}
                      >
                        Send Verification Email
                      </Button>
                      {isButtonDisabled && <p>Next email can be sent in {remainingTime} seconds</p>}
                    </>
                  ) : (
                    <div className="text-center text-white">
                      <h1 style={{ marginTop: "30px" }}>
                        <span
                          style={{
                            marginLeft: "10px",
                            color: "red",
                            transition: "color 0.3s",
                            cursor: "text"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = "red";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = "white";
                          }}
                        >
                          YOU'RE VERIFIED!
                        </span>
                      </h1>
                    </div>
                  )}
                  <div className="sweet-loading">
                    <button onClick={() => setLoading(!loading)}>Toggle Loader</button>
                    <input value={color} onChange={(input) => setColor(input.target.value)} placeholder="Color of the loader" />
                    <p className="user-white-text">Testing out the Loader</p>
                    <a></a>
                    <SyncLoader
                      color={color}
                      loading={loading}
                      cssOverride={override}
                      size={20}
                      aria-label="Loading Spinner"
                      data-testid="loader"
                    />
                  </div>
                  <div className="line"></div>
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="position-relative flex-grow-1 d-flex">
            <div className="user-player-bar d-flex position-fixed bottom-0 w-100 flex-grow-1">
              <Col xs={2} className="d-flex align-items-center p-3 flex-direction-column">
                {currentSongName && (
                  <>
                    <Image src="https://via.placeholder.com/50" rounded />
                    <p className="home-page-text d-flex align-items-center p-2 text-truncate">{currentSongName}</p>
                  </>
                )}
              </Col>
              <Col xs={6}>
                <AudioPlayer src={currentSong} showSkipControls={true} showJumpControls={false} autoPlay onPlay={e => console.log("onPlay")} className='user-player h-100' />
              </Col>
              <Col xs={2}>
                {/* <h1>Settings</h1> */}
              </Col>
              <Col xs={2} className="invisible-text">
                extra space (bad practice, but it works for now)
              </Col>
            </div>
          </div>
        </Container>
      </div>
      <ToastContainer />
    </>
  );
};

export default ArtistPage;
