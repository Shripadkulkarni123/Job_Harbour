import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ResumeModal from "./ResumeModal";

// Create axios instance with base URL
const api = axios.create({
  baseURL: "http://localhost:7000",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const MyApplications = () => {
  const { user } = useContext(Context);
  const [applications, setApplications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [resumeImageUrl, setResumeImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const endpoint = user?.role === "Employer" 
          ? "/api/v1/application/employer/getall"
          : "/api/v1/application/jobseeker/getall";
        
        const { data } = await api.get(endpoint);
        setApplications(data.applications);
      } catch (error) {
        console.error("Error fetching applications:", error);
        setError(error.response?.data?.message || "Failed to fetch applications");
        toast.error(error.response?.data?.message || "Failed to fetch applications");
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthorized) {
      fetchApplications();
    }
  }, [isAuthorized, user?.role]);

  if (!isAuthorized) {
    navigateTo("/");
    return null;
  }

  const deleteApplication = async (id) => {
    try {
      const { data } = await api.delete(`/api/v1/application/delete/${id}`);
      toast.success(data.message);
      setApplications((prevApplications) =>
        prevApplications.filter((application) => application._id !== id)
      );
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error(error.response?.data?.message || "Failed to delete application");
    }
  };

  const openModal = (imageUrl) => {
    setResumeImageUrl(imageUrl);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setResumeImageUrl("");
  };

  if (isLoading) {
    return (
      <section className="my_applications page">
        <div className="container">
          <h1>{user?.role === "Employer" ? "Applications From Job Seekers" : "My Applications"}</h1>
          <div className="loading">Loading applications...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="my_applications page">
        <div className="container">
          <h1>{user?.role === "Employer" ? "Applications From Job Seekers" : "My Applications"}</h1>
          <div className="error-message">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="my_applications page">
      <div className="container">
        <h1>{user?.role === "Employer" ? "Applications From Job Seekers" : "My Applications"}</h1>
        {applications.length === 0 ? (
          <div className="no-applications">
            <h4>No Applications Found</h4>
            {user?.role === "Job Seeker" && (
              <button onClick={() => navigateTo("/job/getall")} className="browse-jobs-btn">
                Browse Jobs
              </button>
            )}
          </div>
        ) : (
          <div className="applications-grid">
            {applications.map((application) => (
              user?.role === "Job Seeker" ? (
                <JobSeekerCard
                  key={application._id}
                  application={application}
                  onDelete={deleteApplication}
                  onViewResume={openModal}
                />
              ) : (
                <EmployerCard
                  key={application._id}
                  application={application}
                  onViewResume={openModal}
                />
              )
            ))}
          </div>
        )}
      </div>
      {modalOpen && (
        <ResumeModal imageUrl={resumeImageUrl} onClose={closeModal} />
      )}
    </section>
  );
};

const JobSeekerCard = ({ application, onDelete, onViewResume }) => {
  return (
    <div className="application-card">
      <div className="application-content">
        <div className="application-details">
          <h3>{application.job?.title || "Job Title Not Available"}</h3>
          <div className="detail-item">
            <span className="label">Name:</span>
            <span className="value">{application.name}</span>
          </div>
          <div className="detail-item">
            <span className="label">Email:</span>
            <span className="value">{application.email}</span>
          </div>
          <div className="detail-item">
            <span className="label">Phone:</span>
            <span className="value">{application.phone}</span>
          </div>
          <div className="detail-item">
            <span className="label">Address:</span>
            <span className="value">{application.address}</span>
          </div>
          <div className="detail-item">
            <span className="label">Cover Letter:</span>
            <p className="value">{application.coverLetter}</p>
          </div>
        </div>
        <div className="application-actions">
          <button 
            className="view-resume-btn"
            onClick={() => onViewResume(application.resume.url)}
          >
            View Resume
          </button>
          <button 
            className="delete-btn"
            onClick={() => onDelete(application._id)}
          >
            Delete Application
          </button>
        </div>
      </div>
    </div>
  );
};

const EmployerCard = ({ application, onViewResume }) => {
  return (
    <div className="application-card">
      <div className="application-content">
        <div className="application-details">
          <h3>{application.job?.title || "Job Title Not Available"}</h3>
          <div className="detail-item">
            <span className="label">Name:</span>
            <span className="value">{application.name}</span>
          </div>
          <div className="detail-item">
            <span className="label">Email:</span>
            <span className="value">{application.email}</span>
          </div>
          <div className="detail-item">
            <span className="label">Phone:</span>
            <span className="value">{application.phone}</span>
          </div>
          <div className="detail-item">
            <span className="label">Address:</span>
            <span className="value">{application.address}</span>
          </div>
          <div className="detail-item">
            <span className="label">Cover Letter:</span>
            <p className="value">{application.coverLetter}</p>
          </div>
        </div>
        <div className="application-actions">
          <button 
            className="view-resume-btn"
            onClick={() => onViewResume(application.resume.url)}
          >
            View Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
