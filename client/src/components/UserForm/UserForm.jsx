import { useState } from "react";
import "./UserForm.css";

const UserForm = ({ onClose, onUserCreated, loading, userToEdit }) => {
  const isEditMode = !!userToEdit;
  
  const [newUser, setNewUser] = useState({
    name: userToEdit?.name || "",
    email: userToEdit?.email || "",
    phone: userToEdit?.phone || "",
    role: userToEdit?.role || "user",
    houseName: userToEdit?.address?.houseName || "",
    poNumber: userToEdit?.address?.poNumber || "",
    landmarks: userToEdit?.address?.landmarks || "",
    locality: userToEdit?.address?.locality || "",
    town: userToEdit?.address?.town || "",
    district: userToEdit?.district || userToEdit?.address?.district || "",
    state: userToEdit?.state || userToEdit?.address?.state || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const userData = {
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: "user",
      district: newUser.district,
      state: newUser.state,
      address: {
        houseName: newUser.houseName,
        poNumber: newUser.poNumber,
        landmarks: newUser.landmarks,
        locality: newUser.locality,
        town: newUser.town,
        district: newUser.district,
        state: newUser.state,
      },
    };

    // Only include password for new users, not for edits
    if (!isEditMode) {
      userData.password = "defaultPassword123";
    }

    console.log(`${isEditMode ? "Updating" : "Creating"} user with:`, userData);
    onUserCreated(userData);
  };

  const handleInputChange = (field, value) => {
    setNewUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setNewUser({
      name: "",
      email: "",
      phone: "",
      role: "user",
      houseName: "",
      poNumber: "",
      landmarks: "",
      locality: "",
      town: "",
      district: "",
      state: "",
    });
  };

  return (
    <div className="user-form-modal-overlay">
      <div className="user-form-modal">
        <div className="user-form-modal-header">
          <h3>{isEditMode ? "Edit User" : "Create User"}</h3>
          <button className="user-form-close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-form-modal-form">
          {/* User Details Section */}
          <div className="user-form-section">
            <h4 className="user-form-section-title">User Details</h4>
            <div className="user-form-row">
              <div className="user-form-group">
                <label>Full Name </label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div className="user-form-group">
                <label>Email </label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className="user-form-group">
                <label>Contact Number </label>
                <input
                  type="tel"
                  value={newUser.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                  placeholder="Enter contact number"
                />
              </div>
            </div>
          </div>

          {/* Address Details Section */}
          <div className="user-form-section">
            <h4 className="user-form-section-title">Address Details</h4>

            {/* Row 1 */}
            <div className="user-form-row">
              <div className="user-form-group">
                <label>House Name/Number </label>
                <input
                  type="text"
                  value={newUser.houseName}
                  onChange={(e) => handleInputChange("houseName", e.target.value)}
                  required
                  placeholder="Enter house name/number"
                />
              </div>

              <div className="user-form-group">
                <label>PO Number</label>
                <input
                  type="text"
                  value={newUser.poNumber}
                  onChange={(e) => handleInputChange("poNumber", e.target.value)}
                  placeholder="Enter PO number"
                />
              </div>

              <div className="user-form-group">
                <label>Landmarks</label>
                <input
                  type="text"
                  value={newUser.landmarks}
                  onChange={(e) => handleInputChange("landmarks", e.target.value)}
                  placeholder="Enter nearby landmarks"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="user-form-row">
              <div className="user-form-group">
                <label>Locality </label>
                <input
                  type="text"
                  value={newUser.locality}
                  onChange={(e) => handleInputChange("locality", e.target.value)}
                  required
                  placeholder="Enter locality"
                />
              </div>

              <div className="user-form-group">
                <label>Town/City </label>
                <input
                  type="text"
                  value={newUser.town}
                  onChange={(e) => handleInputChange("town", e.target.value)}
                  required
                  placeholder="Enter town/city"
                />
              </div>

              <div className="user-form-group">
                <label>District </label>
                <input
                  type="text"
                  value={newUser.district}
                  onChange={(e) => handleInputChange("district", e.target.value)}
                  required
                  placeholder="Enter district"
                />
              </div>
            </div>

            {/* Row 3 - State dropdown */}
            <div className="user-form-row">
              <div className="user-form-group">
                <label>State </label>
                <select
                  value={newUser.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  required
                >
                  <option value="">Select State</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Delhi">Delhi</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Assam">Assam</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              {/* Empty divs to maintain layout */}
              <div className="user-form-group"></div>
              <div className="user-form-group"></div>
            </div>
          </div>

          <div className="user-form-modal-actions">
            <button
              type="button"
              className="user-form-cancel-button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              disabled={loading}
            >
              Back
            </button>
            <button
              type="submit"
              className="user-form-save-button"
              disabled={loading}
            >
              {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update User" : "Create User")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;