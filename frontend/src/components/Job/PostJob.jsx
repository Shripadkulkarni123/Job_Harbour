import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import { FaBriefcase, FaMapMarkerAlt, FaRupeeSign, FaBuilding, FaFileAlt } from "react-icons/fa";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:7000", // Change this to match your backend port
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const PostJob = () => {
  const { isAuthorized, user } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    country: "",
    city: "",
    location: "",
    fixedSalary: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.title || !formData.description || !formData.category || 
          !formData.country || !formData.city || !formData.location || !formData.fixedSalary) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Validate salary
      if (isNaN(formData.fixedSalary) || formData.fixedSalary <= 0) {
        toast.error("Please enter a valid salary amount");
        setIsSubmitting(false);
        return;
      }

      const response = await api.post("/api/v1/job/postjob", formData);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/job/me");
      } else {
        toast.error(response.data.message || "Failed to post job");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      
      if (error.code === "ERR_NETWORK") {
        toast.error("Cannot connect to server. Please check if the backend server is running.");
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.message || "Error posting job");
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server. Please check your connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("Error setting up the request");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthorized || user?.role !== "Employer") {
    navigate("/");
    return null;
  }

  return (
    <section className="postJob">
      <div className="container">
        <div className="header">
          <h1>Post a New Job</h1>
          <p>Fill in the details below to post your job opening</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <FaBriefcase /> Job Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Software Developer"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <FaFileAlt /> Job Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the job responsibilities and requirements..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FaBuilding /> Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="Development">Development</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                <FaRupeeSign /> Fixed Salary (per month)
              </label>
              <input
                type="number"
                name="fixedSalary"
                value={formData.fixedSalary}
                onChange={handleChange}
                placeholder="e.g. 50000"
                required
                min="0"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <FaMapMarkerAlt /> Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="e.g. India"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaMapMarkerAlt /> City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Mumbai"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaMapMarkerAlt /> Location Type
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="">Select Location Type</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default PostJob;
