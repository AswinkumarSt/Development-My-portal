import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Filter from "../Filter/Filter.jsx";
import Footer from "../footer/footer.jsx";
import Navbar from "../navbar/navbar.jsx";
import UserDetail from "../UserDetail/UserDetail.jsx";
import UserForm from "../UserForm/UserForm.jsx";
import "./Dashboard.css";
import filterImage from '/Myportal/client/src/assets/filter1.png';
import groupIcon from '/Myportal/client/src/assets/Group.png';
import arrowIcon from '/Myportal/client/src/assets/Vector.png';

console.log("🔍 UserForm component imported:", !!UserForm);

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ district: "", state: "" });
  
  // Add these states for edit functionality
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  
  const navigate = useNavigate();

  // API base URL for all requests
  const API_BASE_URL = "https://development-my-portal.onrender.com/api";

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      setEditedUser(userObj);

      if (userObj.role === "admin") {
        fetchUsers();
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleAddUser = async (userData) => {
    console.log("handleAddUser called with:", userData);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      // TEMPORARY DEBUG - Check the exact URL
      const requestUrl = `${API_BASE_URL}/users`;
      console.log("🔗 [DEBUG] Making POST request to:", requestUrl);
      console.log("🔗 [DEBUG] Full URL:", requestUrl);
      
      const response = await fetch(requestUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      console.log("📡 [DEBUG] Response status:", response.status);
      
      if (response.ok) {
        console.log("User created successfully");
        setShowAddUserModal(false);
        fetchUsers();
      } else {
        const errorData = await response.json();
        console.error("Failed to create user:", errorData);
        alert(errorData.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      console.error("Error details:", error.message);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add this function for updating users
  const handleUpdateUser = async (userData) => {
    console.log("handleUpdateUser called with:", userData);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/users/${userToEdit._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        console.log("User updated successfully");
        setShowEditUserModal(false);
        setUserToEdit(null);
        fetchUsers(); // Refresh the list
      } else {
        const errorData = await response.json();
        console.error("Failed to update user:", errorData);
        alert(errorData.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/users/profile/me`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editedUser),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setShowEditProfileModal(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle filter application
  const handleApplyFilter = (filters) => {
    setActiveFilters(filters);
  };

  // Handle viewing user details
  const handleViewUserDetails = (userItem) => {
    setSelectedUser(userItem);
    setShowUserDetail(true);
  };

  // Handle edit user - updated to open edit modal
  const handleEditUser = (userItem) => {
    console.log("Edit user:", userItem);
    setUserToEdit(userItem);
    setShowUserDetail(false);
    setShowEditUserModal(true);
  };

  // Handle delete user
  const handleDeleteUser = async (userItem) => {
    if (window.confirm(`Are you sure you want to delete ${userItem.name}?`)) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/users/${userItem._id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          console.log("User deleted successfully");
          setShowUserDetail(false);
          fetchUsers(); // Refresh the user list
        } else {
          const errorData = await response.json();
          alert(errorData.error || "Failed to delete user");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Network error. Please try again.");
      }
    }
  };

  // Extract unique districts from users for the dropdown - using root level district
 const districts = [...new Set(users
  .filter(user => user.district && user.role === "user")
  .map(user => user.district.toLowerCase()) // Convert to lowercase
)].sort();

  // Extract unique states from users for the dropdown - using root level state
  const states = [...new Set(users
    .filter(user => user.state && user.role === "user")
    .map(user => user.state)
  )].sort();

  // Filter users based on search term and active filters - using root level district and state
const filteredUsers = users.filter(
  (userItem) =>
    userItem.role === "user" && (
      userItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userItem.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (userItem.phone && userItem.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (userItem.district && userItem.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (userItem.state && userItem.state.toLowerCase().includes(searchTerm.toLowerCase()))
    ) && (
      // Apply district filter - using lowercase comparison
      (!activeFilters.district || 
       (userItem.district && 
        userItem.district.toLowerCase().includes(activeFilters.district.toLowerCase())))
    ) && (
      // Apply state filter - using lowercase comparison
      (!activeFilters.state || 
       (userItem.state && 
        userItem.state.toLowerCase().includes(activeFilters.state.toLowerCase())))
    )
);

  const isAdmin = user?.role === "admin";

  return (
    <div className="dashboard-wrapper">
      {/* Background Image */}
      <div className="background-image-container">
        <div className="background-image"></div>
      </div>

      {/* Navbar */}
      <Navbar user={user} />

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          {isAdmin ? (
            <>
              <div className="address-book-header">
                <div className="address-book-title">
                  <h2>Address Book</h2>
                </div>
                <div className="address-book-controls">
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input"
                    />
                    
                    {/* Filter image button - now opens filter modal */}
                    <button 
                      className="filter-image-button"
                      onClick={() => setShowFilterModal(true)}
                    >
                      <img 
                        src={filterImage} 
                        alt="Filter" 
                        className="filter-image"
                      />
                    </button>
                  </div>

                  <button
                    className="add-address-button"
                    onClick={() => {
                      console.log("Add Address button clicked!");
                      setShowAddUserModal(true);
                    }}
                  >
                    Add Address
                  </button>
                </div>
              </div>

              {/* Users List */}
              <div className="users-list">
                
                <div className="users-list-body">
                  {filteredUsers.map((userItem) => (
                    <div key={userItem._id} className="user-row">
                      <span className="user-name">
                        <img 
                          src={groupIcon} 
                          alt="Profile" 
                          className="user-profile-icon"
                        />
                        {userItem.name}
                      </span>
                      <span className="user-email">{userItem.email}</span>
                      <span className="user-phone">
                        +91 {userItem.phone || "N/A"}
                      </span>
                      
                      <span className="user-actions">
                        <button 
                          className="arrow-button"
                          onClick={() => handleViewUserDetails(userItem)}
                        >
                          <img 
                            src={arrowIcon} 
                            alt="View details" 
                            className="arrow-icon"
                          />
                        </button>
                      </span>
                    </div>
                  ))}

                  {filteredUsers.length === 0 && (
                    <div className="no-users">
                      {activeFilters.district || activeFilters.state || searchTerm 
                        ? "No users match your search criteria" 
                        : "No users found"
                      }
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Regular user view */}
              <div className="user-welcome">
                <h2>Welcome, {user?.name}!</h2>
                <p>You are logged in as a regular user.</p>
                <button 
                  className="edit-profile-btn"
                  onClick={() => setShowEditProfileModal(true)}
                >
                  Edit Profile
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      {/* UserForm Component for Creating Users */}
      {showAddUserModal && isAdmin && (
        <UserForm
          onClose={() => setShowAddUserModal(false)}
          onUserCreated={handleAddUser}
          loading={loading}
        />
      )}

      {/* UserForm Component for Editing Users */}
      {showEditUserModal && isAdmin && (
        <UserForm
          onClose={() => {
            setShowEditUserModal(false);
            setUserToEdit(null);
          }}
          onUserCreated={handleUpdateUser}
          loading={loading}
          userToEdit={userToEdit}
        />
      )}

      {/* UserDetail Component */}
      {showUserDetail && isAdmin && (
        <UserDetail
          user={selectedUser}
          onClose={() => setShowUserDetail(false)}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
      )}

      {/* Filter Component */}
      {showFilterModal && isAdmin && (
        <Filter
          onClose={() => setShowFilterModal(false)}
          onApplyFilter={handleApplyFilter}
          districts={districts}
          states={states}
          activeFilters={activeFilters}
        />
      )}

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Edit Profile</h3>
              <button
                className="close-button"
                onClick={() => setShowEditProfileModal(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="modal-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editedUser.name || ""}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={editedUser.email || ""}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={editedUser.phone || ""}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, phone: e.target.value })
                  }
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowEditProfileModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="save-button">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Dashboard;