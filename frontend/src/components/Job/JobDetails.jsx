import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../../main";
import { FaBriefcase, FaMapMarkerAlt, FaRupeeSign, FaBuilding, FaCalendarAlt } from "react-icons/fa";

const JobDetails = () => {
  const [job, setJob] = useState(null);
  const { id } = useParams();
  const { isAuthorized, user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/api/v1/job/${id}`,
          {
            withCredentials: true,
          }
        );
        setJob(response.data.job);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    };

    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  if (!isAuthorized) {
    navigate("/login");
    return null;
  }

  if (!job) {
    return (
      <div className="jobDetail">
        <div className="container">
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <section className="jobDetail">
      <div className="container">
        <div className="banner">
          <div className="header">
            <div className="icon">
              <FaBriefcase />
            </div>
            <div className="title">
              <h1>{job.title}</h1>
              <div className="meta">
                <span><FaBuilding /> {job.category}</span>
                <span><FaMapMarkerAlt /> {job.location}, {job.city}, {job.country}</span>
                <span><FaRupeeSign /> {job.fixedSalary ? `${job.fixedSalary}/month` : 'Salary not specified'}</span>
                <span><FaCalendarAlt /> Posted on {new Date(job.jobPostedOn).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="description">
            <h2>Job Description</h2>
            <p>{job.description}</p>
          </div>

          {user && user.role === "Job Seeker" && (
            <div className="apply">
              <button onClick={() => navigate(`/application/${job._id}`)}>
                Apply Now
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default JobDetails;
