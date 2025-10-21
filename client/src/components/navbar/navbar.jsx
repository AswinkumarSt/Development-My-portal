import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";
import groupIcon from '/Myportal/client/src/assets/Group.png'; // Import the group icon

const Navbar = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1 className="navbar-brand">MyPortal</h1>
      </div>

      <div className="navbar-right">
        <div className="profile-section">
          {/* Profile icon moved before the email */}
          <div
            className="profile-icon"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <img 
              src={groupIcon} 
              alt="Profile" 
              className="profile-image"
            />
          </div>
          <span className="user-email">{user?.email}</span>

          {showDropdown && (
            <div className="dropdown-menu">
              
              <div className="dropdown-item" onClick={handleLogout}>
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;