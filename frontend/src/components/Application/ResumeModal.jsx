import React from "react";
import { IoClose } from "react-icons/io5";

const ResumeModal = ({ imageUrl, onClose }) => {
  return (
    <div className="resume-modal">
      <div className="modal-content">
        <button className="close" onClick={onClose}>
          <IoClose />
        </button>
        <img src={imageUrl} alt="Resume" />
      </div>
    </div>
  );
};

export default ResumeModal; 