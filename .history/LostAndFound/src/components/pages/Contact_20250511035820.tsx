import { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3001/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Submission failed.");

      setSubmitted(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (submitted) {
    return (
      <div className="p-6 text-center text-green-600">
        <h2 className="text-2xl font-semibold mb-2">✅ Message Sent!</h2>
        <p>Thank you for contacting us. We'll respond shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea
          name="message"
          required
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm"
      >
        Send Message
      </button>
    </form>
  );
};

export default Contact;
