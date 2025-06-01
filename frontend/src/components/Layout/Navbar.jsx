import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../main";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaBriefcase } from "react-icons/fa";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7000/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setIsAuthorized(false);
      navigateTo("/login");
    } catch (error) {
      toast.error(error.response.data.message), setIsAuthorized(true);
    }
  };

  return (
    <nav>
      <div className="container">
        <div className="logo">
          <Link to="/" className="logo-link">
            <FaBriefcase className="logo-icon" />
            <span className="logo-text">
              <span className="logo-primary">JOB</span>
              <span className="logo-secondary">HARBOUR</span>
            </span>
          </Link>
        </div>
        <ul className={!show ? "menu" : "show-menu menu"}>
          <li>
            <Link to={"/job/getall"} onClick={() => setShow(false)}>
              ALL JOBS
            </Link>
          </li>
          {isAuthorized ? (
            <>
              <li>
                <Link to={"/applications/me"} onClick={() => setShow(false)}>
                  {user && user.role === "Employer"
                    ? "APPLICANT'S APPLICATIONS"
                    : "MY APPLICATIONS"}
                </Link>
              </li>
              {user && user.role === "Employer" ? (
                <>
                  <li>
                    <Link to={"/job/post"} onClick={() => setShow(false)}>
                      POST NEW JOB
                    </Link>
                  </li>
                  <li>
                    <Link to={"/job/me"} onClick={() => setShow(false)}>
                      VIEW YOUR JOBS
                    </Link>
                  </li>
                </>
              ) : null}
              <li>
                <button onClick={handleLogout}>LOGOUT</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to={"/login"} onClick={() => setShow(false)}>
                  LOGIN
                </Link>
              </li>
              <li>
                <Link to={"/register"} onClick={() => setShow(false)}>
                  REGISTER
                </Link>
              </li>
            </>
          )}
        </ul>
        <div className="hamburger">
          <GiHamburgerMenu onClick={() => setShow(!show)} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
