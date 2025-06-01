import axios from "axios";
import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../../main";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:7000",
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const Application = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    coverLetter: "",
    phone: "",
    address: "",
  });
  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();
  const { id } = useParams();

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Function to handle file input changes
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      // Check file type
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Only PDF, JPG, and PNG files are allowed");
        return;
      }
      setResume(file);
      setErrors((prev) => ({
        ...prev,
        resume: "",
      }));
    }
  };

  // Function to validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Invalid phone number";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.coverLetter.trim()) newErrors.coverLetter = "Cover letter is required";
    if (!resume) newErrors.resume = "Resume is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplication = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fill all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    const formDataToSend = new FormData();
    
    // Append all form fields
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    formDataToSend.append("resume", resume);
    formDataToSend.append("jobId", id);

    try {
      const { data } = await api.post("/api/v1/application/post", formDataToSend);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        coverLetter: "",
        phone: "",
        address: "",
      });
      setResume(null);
      setErrors({});
      
      toast.success(data.message);
      navigateTo("/job/getall");
    } catch (error) {
      console.error("Application submission error:", error);
      if (error.response) {
        toast.error(error.response.data.message || "Failed to submit application");
      } else if (error.request) {
        toast.error("No response from server. Please try again later.");
      } else {
        toast.error("Error submitting application. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthorized || (user && user.role === "Employer")) {
    navigateTo("/");
    return null;
  }

  return (
    <section className="application">
      <div className="container">
        <h3>Application Form</h3>
        <form onSubmit={handleApplication}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "error" : ""}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? "error" : ""}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Your Phone Number"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? "error" : ""}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <input
              type="text"
              name="address"
              placeholder="Your Address"
              value={formData.address}
              onChange={handleInputChange}
              className={errors.address ? "error" : ""}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-group">
            <textarea
              name="coverLetter"
              placeholder="Cover Letter..."
              value={formData.coverLetter}
              onChange={handleInputChange}
              className={errors.coverLetter ? "error" : ""}
            />
            {errors.coverLetter && <span className="error-message">{errors.coverLetter}</span>}
          </div>

          <div className="form-group">
            <label>Select Resume (PDF, JPG, or PNG - Max 5MB)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className={errors.resume ? "error" : ""}
            />
            {errors.resume && <span className="error-message">{errors.resume}</span>}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Send Application"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Application;
