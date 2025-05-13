/**
 * SignupForm Component
 * --------------------
 * Handles user registration for TU Lost and Found.
 * - Validates matching passwords and Towson email format.
 * - Sends registration data to backend and shows feedback via Toastify.
 * - Redirects to email verification page on success.
 */

import { useState } from "react";
import Toastify from "toastify-js";
import "toastify-js/src/toastify.css";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match!", false);
      setLoading(false);
      return;
    }

    try {
      const baseUrl = (import.meta.env['PUBLIC_API_BASE_URL'] || "").replace(/\/$/, "");
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          tuEmail: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      showToast("Registration successful! Please check your email for verification.");
      setTimeout(() => {
        window.location.href = `/verification?email=${formData.email}`;
      }, 2000);
    } catch (err: any) {
      showToast(err.message || "An error occurred", false);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-3xl font-bold text-center text-gray-900">Create your account</h2>
      <p className="text-sm text-center text-gray-600">Join TU Lost and Found community</p>

      <div className="flex gap-4">
        <input name="firstName" type="text" required placeholder="First Name" value={formData.firstName} onChange={handleChange} className="w-1/2 px-3 py-2 border border-gray-300 rounded-md" />
        <input name="lastName" type="text" required placeholder="Last Name" value={formData.lastName} onChange={handleChange} className="w-1/2 px-3 py-2 border border-gray-300 rounded-md" />
      </div>

      <input name="email" type="email" pattern="[a-zA-Z0-9._%+-]+@students\\.towson\\.edu$" required placeholder="username@students.towson.edu" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
      <input name="phone" type="tel" pattern="[0-9]{10}" placeholder="Phone Number (optional)" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
      <input name="password" type="password" required minLength={8} placeholder="Password (min. 8 characters)" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
      <input name="confirmPassword" type="password" required placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />

      <button type="submit" disabled={loading} className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded-md">
        {loading ? "Signing up..." : "Sign up"}
      </button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?
        <a href="/login" className="text-yellow-600 hover:text-yellow-500 ml-1">Sign in</a>
      </p>
    </form>
  );
};

export default SignupForm;
