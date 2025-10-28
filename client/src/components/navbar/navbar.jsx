import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./navbar.css";
import groupIcon from '/Myportal/client/src/assets/Group.png';

const Navbar = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

      {/* Mobile Menu Button */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`navbar-right ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="profile-section">
          {/* Profile icon and email - visible on desktop */}
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

        {/* Mobile-only logout option */}
        <div className="mobile-logout-option">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;