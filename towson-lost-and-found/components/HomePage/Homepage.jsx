import React from "react";
import { Link } from "react-router-dom";
import "./HomePage.css";

export default function Homepage() {
  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="logo">
          <img src="towson-logo.png" alt="Towson University" />
        </div>
      </nav>

      <div className="header">
        <h1>Towson University Lost and Found</h1>
        <Link to="/login" className="login-button">
          Login / Sign Up
        </Link>
      </div>
    </div>
  );
}
