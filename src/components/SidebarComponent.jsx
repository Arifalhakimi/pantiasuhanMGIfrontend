import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import {
  FaTachometerAlt,
  FaHandHoldingUsd,
  FaProjectDiagram,
  FaCheckCircle,
  FaEnvelope,
  FaUsers,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SidebarComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        <FaBars />
      </div>

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h2 className="sidebar-title">Panti Asuhan</h2>
        <Nav defaultActiveKey="/home" className="flex-column sidebar-nav">
          <Nav.Link href="/admin/dashboard">
            <FaTachometerAlt className="sidebar-icon" />
            Dashboard
          </Nav.Link>
          <Nav.Link href="/admin/datadonasi">
            <FaHandHoldingUsd className="sidebar-icon" />
            Data Donasi
          </Nav.Link>
          <Nav.Link href="/admin/data-user">
            <FaUsers className="sidebar-icon" />
            User
          </Nav.Link>
          <Nav.Link href="/admin/data-pesan">
            <FaEnvelope className="sidebar-icon" />
            Pesan
          </Nav.Link>
          <Nav.Link onClick={handleLogout} className="logout-link">
            <FaSignOutAlt className="sidebar-icon" />
            Logout
          </Nav.Link>
        </Nav>
      </div>
    </>
  );
};

export default SidebarComponent;
