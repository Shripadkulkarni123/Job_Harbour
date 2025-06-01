import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaEdit, FaTrash, FaClock } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Context } from "../../main";
import { useNavigate } from "react-router-dom";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:7000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const MyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [editingMode, setEditingMode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  // Fetching all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const { data } = await api.get("/api/v1/job/getmyjobs");
        setMyJobs(data.myJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error(error.response?.data?.message || "Failed to fetch jobs");
        setMyJobs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (!isAuthorized || (user && user.role !== "Employer")) {
    navigateTo("/");
    return null;
  }

  // Function For Enabling Editing Mode
  const handleEnableEdit = (jobId) => {
    setEditingMode(jobId);
  };

  // Function For Disabling Editing Mode
  const handleDisableEdit = () => {
    setEditingMode(null);
  };

  // Function For Updating The Job
  const handleUpdateJob = async (jobId) => {
    try {
      const updatedJob = myJobs.find((job) => job._id === jobId);
      const { data } = await api.put(`/api/v1/job/update/${jobId}`, updatedJob);
      toast.success(data.message);
      setEditingMode(null);
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error(error.response?.data?.message || "Failed to update job");
    }
  };

  // Function For Deleting Job
  const handleDeleteJob = async (jobId) => {
    try {
      const { data } = await api.delete(`/api/v1/job/delete/${jobId}`);
      toast.success(data.message);
      setMyJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error(error.response?.data?.message || "Failed to delete job");
    }
  };

  // Function For Toggling Job Expiry
  const handleToggleExpiry = async (jobId) => {
    try {
      const job = myJobs.find((job) => job._id === jobId);
      const updatedJob = { ...job, expired: !job.expired };
      const { data } = await api.put(`/api/v1/job/update/${jobId}`, updatedJob);
      setMyJobs((prevJobs) =>
        prevJobs.map((job) =>
          job._id === jobId ? { ...job, expired: !job.expired } : job
        )
      );
      toast.success(data.message);
    } catch (error) {
      console.error("Error toggling job expiry:", error);
      toast.error(error.response?.data?.message || "Failed to update job status");
    }
  };

  const handleInputChange = (jobId, field, value) => {
    setMyJobs((prevJobs) =>
      prevJobs.map((job) =>
        job._id === jobId ? { ...job, [field]: value } : job
      )
    );
  };

  if (isLoading) {
    return (
      <div className="myJobs page">
        <div className="container">
          <h1>Your Posted Jobs</h1>
          <div className="loading">Loading your jobs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="myJobs page">
      <div className="container">
        <h1>Your Posted Jobs</h1>
        {myJobs.length === 0 ? (
          <div className="no-jobs">
            <p>You haven't posted any jobs yet.</p>
            <button onClick={() => navigateTo("/job/post")} className="post-job-btn">
              Post a New Job
            </button>
          </div>
        ) : (
          <div className="banner">
            {myJobs.map((job) => (
              <div className={`card ${job.expired ? 'expired' : ''}`} key={job._id}>
                <div className="content">
                  <div className="job-status">
                    <span className={`status-badge ${job.expired ? 'expired' : 'active'}`}>
                      {job.expired ? 'Expired' : 'Active'}
                    </span>
                  </div>
                  <div className="short_fields">
                    <div>
                      <span>Title:</span>
                      <input
                        type="text"
                        disabled={editingMode !== job._id}
                        value={job.title}
                        onChange={(e) => handleInputChange(job._id, "title", e.target.value)}
                      />
                    </div>
                    <div>
                      <span>Country:</span>
                      <input
                        type="text"
                        disabled={editingMode !== job._id}
                        value={job.country}
                        onChange={(e) => handleInputChange(job._id, "country", e.target.value)}
                      />
                    </div>
                    <div>
                      <span>City:</span>
                      <input
                        type="text"
                        disabled={editingMode !== job._id}
                        value={job.city}
                        onChange={(e) => handleInputChange(job._id, "city", e.target.value)}
                      />
                    </div>
                    <div>
                      <span>Category:</span>
                      <select
                        value={job.category}
                        onChange={(e) => handleInputChange(job._id, "category", e.target.value)}
                        disabled={editingMode !== job._id}
                      >
                        <option value="Development">Development</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <span>Salary:</span>
                      <input
                        type="number"
                        disabled={editingMode !== job._id}
                        value={job.fixedSalary}
                        onChange={(e) => handleInputChange(job._id, "fixedSalary", e.target.value)}
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="long_fields">
                    <div>
                      <span>Description:</span>
                      <textarea
                        disabled={editingMode !== job._id}
                        value={job.description}
                        onChange={(e) => handleInputChange(job._id, "description", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="button_wrapper">
                    {editingMode === job._id ? (
                      <>
                        <button onClick={() => handleUpdateJob(job._id)} className="checkBtn">
                          <FaCheck />
                        </button>
                        <button onClick={handleDisableEdit} className="crossBtn">
                          <RxCross2 />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEnableEdit(job._id)} className="editBtn">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDeleteJob(job._id)} className="deleteBtn">
                          <FaTrash />
                        </button>
                        <button 
                          onClick={() => handleToggleExpiry(job._id)} 
                          className={`expiryBtn ${job.expired ? 'reactivate' : 'expire'}`}
                        >
                          <FaClock />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
