import React, { useEffect, useRef, useState } from "react";
import "../css/login.css";
import logo from "../assets/images/youtify.png";
import { Link, useNavigate } from "react-router-dom";
import { Bounce, toast } from "react-toastify";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const emailRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [email, password]);

  const login_fail = () => {
    toast.error("Login unsuccessful.", {
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
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt_token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(`http://localhost/api/login`, formData);

      const token = response.data.access_token;
      localStorage.setItem("jwt_token", token);
      navigate('/home');
    } catch (error) {
      login_fail();
    }
  };

  return (
    <div className="d-flex flex-column l-bg text-white vh-100">
      <header className="bg-dark">
        <Link to={"/"}>
          <img src={logo} alt="YOUTIFY" className="p-3" />
        </Link>
      </header>
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
        <h1>Log In to Youtify</h1>
        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <form
          onSubmit={handleSubmit}
          className="d-flex flex-column justify-content-center w-25"
        >
          <div className="mb-3">
            <label htmlFor="email">Email Adress</label>
            <input
              type="email"
              id="email"
              ref={emailRef}
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="form-control rounded-pill"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
              className="form-control rounded-pill"
            />
          </div>
          <button className="btn btn-danger rounded-pill">Log In</button>
        </form>
        <div className="d-flex">
          <p className="p-1">Don't have an account?</p>
          <Link
            to={"/register"}
            className="p-1 text-danger"
            style={{ textDecoration: "none" }}
          >
            Sign up now.
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
