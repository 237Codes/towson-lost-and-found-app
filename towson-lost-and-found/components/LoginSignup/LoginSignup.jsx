import React, { useState } from "react";
import "./LoginSignup.css";

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    return email.toLowerCase().endsWith("@students.towson.edu");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(formData.email)) {
      setError(
        "Please use a valid Towson University email address (@towson.edu)"
      );
      return;
    }

    try {
      // Choose endpoint based on whether user is logging in or signing up
      const endpoint = isLogin ? "/login" : "/signup";
      const response = await fetch(
        `http://localhost:5001/api/auth${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        if (isLogin) {
          // If logging in, save token and redirect
          localStorage.setItem("token", data.token);
          window.location.href = "/dashboard";
        } else {
          // If signing up, show verification step
          setVerificationStep(true);
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to connect to server");
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5001/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Failed to verify code");
    }
  };

  // Render verification form if in verification step
  if (verificationStep) {
    return (
      <div className="login-signup-container">
        <div className="form-box">
          <h2>Verify Your Email</h2>
          <p>Enter the verification code sent to {formData.email}</p>
          <form onSubmit={handleVerification}>
            <div className="form-group">
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter verification code"
                required
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit">Verify</button>
          </form>
        </div>
      </div>
    );
  }

  // Render login/signup form
  return (
    <div className="login-signup-container">
      <div className="form-box">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required={!isLogin}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Towson Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>

        <p className="toggle-form">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            className="toggle-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
