import "./ProfileSidebar.css";

export default function ProfileSidebar({ user, onClose }) {
  // Extract info with fallbacks for seeded admins that might not have email/phone
  const email = user.email || "Not provided";
  const phone = user.phoneNumber || "Not provided";
  const role = user.isAdmin ? "Administrator" : "Citizen";

  return (
    <>
      <div className="profile-overlay" onClick={onClose}></div>
      <div className="profile-sidebar">
        <div className="profile-header">
          <h2>User Profile</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="profile-content">
          <div className="profile-avatar-large">👤</div>
          <h3 className="profile-username">{user.username}</h3>
          <span className={`profile-role ${user.isAdmin ? 'role-admin' : 'role-citizen'}`}>
            {role}
          </span>

          <div className="profile-details">
            <div className="detail-item">
              <span className="detail-label">Email Address</span>
              <span className="detail-value">{email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone Number</span>
              <span className="detail-value">{phone}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
