import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { FaBriefcase, FaMapMarkerAlt, FaRupeeSign } from "react-icons/fa";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const { isAuthorized } = useContext(Context);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:7000/api/v1/job/getall",
          {
            withCredentials: true,
          }
        );
        setJobs(response.data.jobs || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  if (!isAuthorized) {
    navigateTo("/login");
    return null;
  }

  return (
    <section className="jobs page">
      <div className="container">
        <h1>ALL AVAILABLE JOBS</h1>
        <div className="banner">
          {jobs.map((job) => (
            <div className="card" key={job._id}>
              <div className="content">
                <div className="icon">
                  <FaBriefcase />
                </div>
                <div className="text">
                  <h3>{job.title}</h3>
                  <p className="description">{job.description}</p>
                  <div className="details">
                    <span><FaMapMarkerAlt /> {job.location}, {job.city}, {job.country}</span>
                    <span><FaRupeeSign /> {job.fixedSalary ? `${job.fixedSalary}/month` : 'Salary not specified'}</span>
                    <span>Category: {job.category}</span>
                  </div>
                </div>
              </div>
              <Link to={`/job/${job._id}`} className="view-btn">View Details</Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Jobs;
