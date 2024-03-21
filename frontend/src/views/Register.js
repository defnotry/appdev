import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast, Flip } from "react-toastify";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Spinner } from "react-bootstrap";
import "../css/register.css";
import logo from "../assets/images/youtify.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

const NAME_REGEX = /^[a-zA-Z0-9!@#$%^&*()-_=;:'",.<>/?]{4,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]{1,255}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PASS_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,24}$/;

function Register() {
  const navigate = useNavigate();

  const nameRef = useRef();
  const errRef = useRef();

  const [name, setName] = useState("");
  const [validName, setValidName] = useState(false);
  const [nameFocus, setNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    nameRef.current.focus();
  }, []);

  useEffect(() => {
    setValidName(NAME_REGEX.test(name));
  }, [name]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setValidPassword(PASS_REGEX.test(password));
    const match = password === confirmPassword;
    setValidMatch(match);
  }, [password, confirmPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [name, email, password, confirmPassword]);

  const [userType, setUserType] = useState("listener");

  const handleUserType = (type) => {
    setUserType(type);
  };

  const [showModal, setShowModal] = useState(false);
  const handleModalClose = () => setShowModal(false);
  const handleModalShow = () => setShowModal(true);

  const [TOAAccepted, setTOAAccepted] = useState(false);

  const handleAcceptTOA = () => {
    setTOAAccepted(true);
    handleModalClose();
  };

  const registration_failed = (message) =>
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      progress: Spinner,
      theme: "dark",
      transition: Flip,
    });

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      navigate("/login");
    }
  }, [navigate]); //remove navigate if error

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    };

    try {
      await axios.post(
        `http://localhost/api/register-${
          userType === "artist" ? "artist" : "listener"
        }`,
        formData
      );

      navigate("/login");
    } catch (error) {
      registration_failed(error.response.data.message);
      console.log("Axios error:", error);
    }
  };

  return (
    <>
      <div className="d-flex flex-column r-bg text-white vh-100">
        <Modal
          show={showModal}
          onHide={handleModalClose}
          backdrop="static"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Terms and Conditions of Use and Privacy Policy
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
              consequat nunc id ligula rhoncus, at tincidunt odio vehicula.
              Nullam ut libero arcu. Vivamus rutrum, elit sit amet consequat
              sodales, felis lacus varius nulla, nec commodo lorem lectus ac
              justo. Nulla facilisi. Integer feugiat lorem non augue aliquet, id
              mattis purus malesuada. Sed id arcu eu sapien hendrerit pretium.
              Duis lacinia pulvinar eros. Donec sed sapien at mi malesuada
              ultrices a a justo. Suspendisse potenti. Morbi auctor fringilla
              nunc, vel efficitur neque facilisis a. Fusce rhoncus tortor nec
              gravida volutpat. Ut vitae ultricies ligula. Aliquam erat
              volutpat. Sed lobortis arcu sit amet massa ultricies dapibus.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Decline
            </Button>
            <Button variant="danger" onClick={handleAcceptTOA}>
              Accept
            </Button>
          </Modal.Footer>
        </Modal>

        <header className="bg-dark">
          <Link to={"/"}>
            <img src={logo} alt="YOUTIFY" className="p-3" />
          </Link>
        </header>
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <h1 className="mb-3">Sign up for your music journey.</h1>
          <form
            onSubmit={handleSubmit}
            className="form-container d-flex flex-column w-25"
          >
            <div className="d-flex flex-column mb-3">
              <label htmlFor="name">
                Username:{" "}
                <span className={validName ? "valid" : "hide"}>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validName || !name ? "hide" : "invalid"}>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </label>
              <input
                type="text"
                id="name"
                ref={nameRef}
                autoComplete="off"
                onChange={(e) => setName(e.target.value)}
                required
                aria-invalid={validName ? "false" : "true"}
                aria-describedby="uidnote"
                onFocus={() => setNameFocus(true)}
                onBlur={() => setNameFocus(false)}
                placeholder="Enter name"
                className="form-control rounded-pill"
              />
              <p
                id="uidnote"
                className={
                  nameFocus && name && !validName ? "instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} /> <br />
                4 to 24 characters. <br />
                Letters, numbers underscores, hyphens allowed.
              </p>
            </div>

            <div className="d-flex flex-column mb-3">
              <label htmlFor="email">
                Email Address:{" "}
                <span className={validEmail ? "valid" : "hide"}>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validEmail || !email ? "hide" : "invalid"}>
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </label>
              <input
                type="email"
                id="email"
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-invalid={validEmail ? "false" : "true"}
                aria-describedby="emailnote"
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
                placeholder="Example@domain.com"
                className="form-control rounded-pill"
              />
              <p
                id="emailnote"
                className={
                  emailFocus && email && !validEmail
                    ? "instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} /> <br />
                Enter a valid email address.
              </p>
            </div>

            <div className="d-flex flex-column mb-3">
              <label htmlFor="password">
                Password:{" "}
                <span className={validPassword ? "valid" : "hide"}>
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span
                  className={validPassword || !password ? "hide" : "invalid"}
                >
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </label>
              <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-invalid={validPassword ? "false" : "true"}
                aria-describedby="pwdnote"
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
                placeholder="●●●●●●●●●●●●●●●●●●●●●●●●"
                className="form-control rounded-pill"
              />
              <p
                id="pwdnote"
                className={
                  passwordFocus && !validPassword ? "instructions" : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} /> <br />
                8 to 24 characters. <br />
                Must include UPPERCASE and lowercase letters, and a number.{" "}
                <br />
                (Optional) Allowed special characters:{" "}
                <span aria-label="exclamation mark">!</span>
                <span aria-label="at symbol">@</span>
                <span aria-label="hashtag">#</span>
                <span aria-label="dollar sign">$</span>
                <span aria-label="percent">%</span>
              </p>
            </div>

            <div className="d-flex flex-column mb-3">
              <label htmlFor="confirm_password">
                Confirm Password:{" "}
                <span
                  className={validMatch && confirmPassword ? "valid" : "hide"}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </span>
                <span
                  className={
                    validMatch || !confirmPassword ? "hide" : "invalid"
                  }
                >
                  <FontAwesomeIcon icon={faTimes} />
                </span>
              </label>
              <input
                type="password"
                id="confirm_password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                aria-invalid={validMatch ? "false" : "true"}
                aria-describedby="cpwdnote"
                onFocus={() => setConfirmPasswordFocus(true)}
                onBlur={() => setConfirmPasswordFocus(false)}
                placeholder="●●●●●●●●●●●●●●●●●●●●●●●●"
                className="form-control rounded-pill"
              />
              <p
                id="cpwdnote"
                className={
                  confirmPasswordFocus && !validMatch
                    ? "instructions"
                    : "offscreen"
                }
              >
                <FontAwesomeIcon icon={faInfoCircle} /> <br />
                Password must match.
              </p>
            </div>

            <div className="mb-3">
              <p className="text-center">Signup as:</p>
              <div className="d-flex justify-content-center">
                <div className="p-2">
                  <input
                    type="radio"
                    id="listenerRadio"
                    name="registrationType"
                    value="listener"
                    checked={userType === "listener"}
                    onChange={() => handleUserType("listener")}
                  />
                  <label htmlFor="listenerRadio" className="ms-2">
                    Listener
                  </label>
                </div>

                <div className="p-2">
                  <input
                    type="radio"
                    id="artistRadio"
                    name="registrationType"
                    value="artist"
                    checked={userType === "artist"}
                    onChange={() => handleUserType("artist")}
                  />
                  <label htmlFor="artistRadio" className="ms-2">
                    Artist
                  </label>
                </div>
              </div>
            </div>
            <div className="d-flex flex-column justify-content-center align-items-center mb-3">
              <Form.Check
                type="checkbox"
                label={
                  <span>
                    I agree to YOUTIFY{" "}
                    <span className="text-danger" onClick={handleModalShow}>
                      Terms and Conditions
                    </span>{" "}
                    of use
                  </span>
                }
                checked={TOAAccepted}
                onChange={() => setTOAAccepted(!TOAAccepted)}
              />
            </div>

            <button
              className="btn btn-danger rounded-pill"
              type="submit"
              disabled={
                !TOAAccepted ||
                !validName ||
                !validEmail ||
                !validPassword ||
                !validMatch
                  ? true
                  : false
              }
            >
              Sign up
            </button>
          </form>
          <div className="d-flex">
            <p className="p-1">Already have an account?</p>
            <Link
              to={"/login"}
              className="p-1 text-danger"
              style={{ textDecoration: "none" }}
            >
              Login here.
            </Link>
          </div>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default Register;
