import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBuilding, FaMapMarkerAlt, FaBriefcase, FaSearch, FaUserPlus, FaFileAlt } from "react-icons/fa";
import PopularCompanies from "./PopularCompanies";

const Home = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: 1,
      title: "Software Development",
      count: "150+ Jobs",
      icon: <FaBuilding />,
    },
    {
      id: 2,
      title: "Data Science",
      count: "120+ Jobs",
      icon: <FaFileAlt />,
    },
    {
      id: 3,
      title: "Design",
      count: "90+ Jobs",
      icon: <FaUserPlus />,
    },
    {
      id: 4,
      title: "Marketing",
      count: "80+ Jobs",
      icon: <FaSearch />,
    },
  ];

  const howItWorks = [
    {
      id: 1,
      title: "Create an Account",
      description: "Sign up and create your professional profile to get started",
      icon: <FaUserPlus />,
    },
    {
      id: 2,
      title: "Search Jobs",
      description: "Browse through thousands of job listings that match your skills",
      icon: <FaSearch />,
    },
    {
      id: 3,
      title: "Apply & Get Hired",
      description: "Apply to jobs and get hired by top companies worldwide",
      icon: <FaFileAlt />,
    },
  ];

  return (
    <div className="homePage">
      {/* Hero Section */}
      <section className="heroSection">
        <div className="container">
          <h1>Find Your Dream Job Today</h1>
          <p>Discover thousands of job opportunities with top companies worldwide</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="howitworks">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Follow these simple steps to find your perfect job</p>
          </div>
          <div className="banner">
            {howItWorks.map((item) => (
              <div key={item.id} className="card">
                {item.icon}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories Section */}
      <section className="categories">
        <div className="container">
          <div className="section-header">
            <h2>Popular Categories</h2>
            <p>Explore jobs by category and find your perfect match</p>
          </div>
          <div className="banner">
            {categories.map((category) => (
              <div key={category.id} className="card">
                <div className="icon">{category.icon}</div>
                <div className="text">
                  <h4>{category.title}</h4>
                  <p>{category.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Companies Section */}
      <PopularCompanies />
    </div>
  );
};

export default Home;
