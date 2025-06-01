import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../../main";
import { FaBars } from "react-icons/fa";

const Navbar = () => {
  const { isAuthorized, setIsAuthorized, user } = useContext(Context);
  const [showMenu, setShowMenu] = React.useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthorized(false);
    navigate("/login");
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  return (
    <nav>
      <div className="container">
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src="/logo.png" alt="Job Hunt Logo" />
          <span>Job Hunt</span>
        </Link>
        <ul className={`menu ${showMenu ? "show-menu" : ""}`}>
          <li>
            <Link to="/" onClick={closeMenu}>Home</Link>
          </li>
          <li>
            <Link to="/jobs" onClick={closeMenu}>All Jobs</Link>
          </li>
          {isAuthorized ? (
            <>
              {user && user.role === "Employer" ? (
                <>
                  <li>
                    <Link to="/job/post" onClick={closeMenu}>Post New Job</Link>
                  </li>
                  <li>
                    <Link to="/my/jobs" onClick={closeMenu}>My Jobs</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/my/applications" onClick={closeMenu}>My Applications</Link>
                  </li>
                </>
              )}
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : null}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar; 