import React, { useContext } from "react";
import { Context } from "../../main";
import { FaLinkedin, FaGithub } from "react-icons/fa";

const Footer = () => {
  const { isAuthorized } = useContext(Context);
  return (
    <footer className={isAuthorized ? "footerShow" : "footerHide"}>
      <div>&copy; All Rights Reserved By JobHunter.</div>
      <div>
        <a href="https://www.linkedin.com/in/shripad-kulkarni-48b74425b/" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>
        <a href="https://github.com/Shripadkulkarni123" target="_blank" rel="noopener noreferrer">
          <FaGithub />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
