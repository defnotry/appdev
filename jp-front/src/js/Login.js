import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { ToastContainer, toast, Bounce, Flip } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BACKEND_URL from "../config";

function Login() {
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const register_success = () => {
    toast.success("User registered successfully.", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
      onClose: () => {
        localStorage.setItem('justRegistered', 'false');
      }
    });
  }

  const login_fail = () => {
    toast.error("User failed to login.", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  }

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      navigate('/home');
    }

    if (localStorage.getItem('justRegistered') === 'true') {
      register_success();
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonDisabled(true);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/login`,
        formData,
      );
      setFormData({
        email: "",
        password: "",
      });

      const token = response.data.access_token;
      localStorage.setItem("jwt_token", token); // change this in the future
      navigate("/home");

    } catch (error) {
      console.error("Login failed:", error);
      setButtonDisabled(false);
      login_fail();
    }
  };


  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Container className="main-container">
        <Row className="justify-content-md-center">
          <Col xs={10} md={6}>
            <div className="text-center text-white">
              <h1>
                Log in to
                <span>
                  MEDIAHARBOR
                </span>
              </h1>
            </div>

            <div className="d-flex flex-column align-items-center">
              <Button
                variant="outline-danger"
                className="social-button mr-2 btn-sm rounded-pill"
              >
                <img
                  src={process.env.PUBLIC_URL + "/register/google.png"}
                  alt="Google Logo"
                  className="mr-2"
                />
                Login with Google
              </Button>

              <Button
                variant="outline-danger"
                className="social-button mr-2 btn-sm rounded-pill login-facebook"
              >
                <img
                  src={process.env.PUBLIC_URL + "/register/facebook.png"}
                  alt="Facebook Logo"
                  className="mr-2"
                  style={{
                    marginRight: "20px",
                    width: "30px",
                    margin: "flex",
                  }}
                />
                Login with Facebook
              </Button>

              <Button
                variant="outline-danger"
                className="social-button mr-2 btn-sm rounded-pill button"
              >
                <img
                  src={process.env.PUBLIC_URL + "/register/apple.png"}
                  alt="Apple Logo"
                  className="mr-2"
                />
                Continue with Apple
              </Button>
              <div className="line"></div>
            </div>
            <Form className="main-content" onSubmit={handleSubmit}>
              <Form.Group className="d-flex flex-column align-items-start text-input-container">
                <Form.Label className="label">Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </Form.Group>

              <Form.Group className="d-flex flex-column align-items-start">
                <Form.Label className="label">Password</Form.Label>
                <Form.Control
                  type="password"
                  id="inputPassword"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control"
                  aria-describedby="passwordHelpBlock"
                />
              </Form.Group>

              <div className="d-flex flex-row justify-content-between align-items-center login-options">
                <div className="remember-me">
                  <Form.Check type="checkbox" label="Remember me" />
                </div>
                <a href="
              ">
                  <em>Forgot password?</em>
                </a>
              </div>

              <Button
                variant="outline-danger"
                className="btn btn-outline-danger login-button btn-block rounded-pill"
                type="submit"
                disabled={buttonDisabled}
              >
                Login
              </Button>

              <hr className="my-4 bg-dark text-white" />
              <div className="text-center">
                <p>
                  Don't have an account?{" "}
                  <Link to="/" className="signup">
                    Sign up here
                  </Link>
                </p>
              </div>
            </Form>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
}

export default Login;
