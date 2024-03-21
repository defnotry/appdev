import React from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const EmptyPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement logout functionality or any other action needed here
    // For now, let's just navigate to the login page
    navigate('/login');
  };

  return (
    <Container className="main-container">
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
            404: PAGE NOT FOUND
          </span>
        </h1>
      </div>


    </Container>
  );
};

export default EmptyPage;
