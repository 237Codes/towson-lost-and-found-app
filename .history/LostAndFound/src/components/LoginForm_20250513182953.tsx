/**
 * LoginForm Component
 * -------------------
 * Handles user authentication for TU Lost and Found.
 * - Validates Towson email format and password input.
 * - Sends login request to backend and stores session data.
 * - Displays success or error feedback using Toastify.
 * - Redirects to the feed page on successful login.
 */

import { useState } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const showToast = (msg: string, success = true) => {
    Toastify({
      text: msg,
      duration: 3000,
      gravity: "bottom",
      position: "right",
      style: {
        background: success ? "#FFB800" : "#EF4444",
        color: "white",
        borderRadius: "8px",
      },
    }).showToast();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      const remember = (document.getElementById("remember-me") as HTMLInputElement).checked;
      remember
        ? localStorage.setItem("user", JSON.stringify(data.user))
        : sessionStorage.setItem("user", JSON.stringify(data.user));

      showToast("Successfully logged in!");
      setTimeout(() => (window.location.href = "/feed"), 1500);
    } catch (err: any) {
      showToast(err.message || "An error occurred", false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Login to TU Lost and Found</h2>
        <p className="mt-2 text-sm text-gray-600">Report and track lost/found items on campus</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="email"
          id="email"
          placeholder="username@students.towson.edu"
          required
          pattern="[a-zA-Z0-9._%+-]+@students\\.towson\\.edu$"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
        />
        <input
          type="password"
          id="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500"
        />

        <div className="flex items-center space-x-2">
          <input id="remember-me" type="checkbox" className="h-4 w-4 text-yellow-600" />
          <label htmlFor="remember-me" className="text-sm text-gray-700">Remember me</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center items-center bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700"
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Don’t have an account?{" "}
        <a href="/signup" className="text-yellow-600 font-medium hover:text-yellow-500">Sign up</a>
      </p>
    </div>
  );
};

export default LoginForm;
