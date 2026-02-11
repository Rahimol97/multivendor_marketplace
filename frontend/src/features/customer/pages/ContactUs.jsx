import React, { useState } from "react";
import Carousel from "../../../components/customer/Carousel";
import api from "../../../api";

function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.post("/customer/contactus", form);
      setSuccess("Message sent successfully! We'll contact you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      alert("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full pt-28 md:pt-24 bg-(--light-bg) min-h-screen">

      <Carousel />

      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10">
        
        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-(--dark-teal)">Get in Touch</h2>
          <p className="text-(--mid-teal)">
            Have questions, feedback, or need help? Our team is here for you.
          </p>

          <div className="space-y-4 text-sm text-gray-700">
            <p><strong>Email:</strong> support@multinest.com</p>
            <p><strong>Phone:</strong> +91 9800000000</p>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
          <h3 className="text-xl font-semibold text-(--dark-teal)">Send Message</h3>

          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-md"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-md"
          />

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-md"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={form.message}
            onChange={handleChange}
            required
            className="w-full border p-3 rounded-md"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-(--mid-teal) text-white py-3 rounded-lg hover:bg-(--bright-teal) transition"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>

          {success && <p className="text-green-600 text-sm">{success}</p>}
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
