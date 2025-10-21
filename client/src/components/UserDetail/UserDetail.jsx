import './UserDetail.css';

const UserDetail = ({ user, onClose, onEdit, onDelete }) => {
  if (!user) return null;

  return (
    <div className="user-detail-overlay">
      <div className="user-detail-modal">
        <div className="user-detail-header">
          <h2 className="user-detail-title">User Details</h2>
          <button className="user-detail-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="user-detail-content">
          {/* Main User Details */}
          <div className="detail-section">
            <div className="detail-item">
              <label className="detail-label">Name</label>
              <div className="detail-value">{user.name}</div>
            </div>
            
            <div className="detail-row">
              <div className="detail-item">
                <label className="detail-label">Email</label>
                <div className="detail-value">{user.email}</div>
              </div>
              <div className="detail-item">
                <label className="detail-label">Contact</label>
                <div className="detail-value">+91 {user.phone || "N/A"}</div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="detail-section">
            <label className="section-label">Address</label>
            
            <div className="detail-row">
              <div className="detail-item">
                <label className="detail-label">House Name</label>
                <div className="detail-value">{user.address?.houseName || "N/A"}</div>
              </div>
              <div className="detail-item">
                <label className="detail-label">PO No</label>
                <div className="detail-value">{user.address?.poNumber || "N/A"}</div>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-item">
                <label className="detail-label">Landmarks</label>
                <div className="detail-value">{user.address?.landmarks || "N/A"}</div>
              </div>
              <div className="detail-item">
                <label className="detail-label">Locality</label>
                <div className="detail-value">{user.address?.locality || "N/A"}</div>
              </div>
            </div>

            <div className="detail-row triple">
              <div className="detail-item">
                <label className="detail-label">Town</label>
                <div className="detail-value">{user.address?.town || "N/A"}</div>
              </div>
              <div className="detail-item">
                <label className="detail-label">District</label>
                <div className="detail-value">{user.district || user.address?.district || "N/A"}</div>
              </div>
              <div className="detail-item">
                <label className="detail-label">State</label>
                <div className="detail-value">{user.state || user.address?.state || "N/A"}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="user-detail-actions">
          <button 
            className="delete-button"
            onClick={() => onDelete(user)}
          >
            Delete
          </button>
          <button 
            className="edit-button"
            onClick={() => onEdit(user)}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;