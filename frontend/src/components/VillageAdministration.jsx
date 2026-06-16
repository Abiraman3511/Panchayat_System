import { useState, useEffect } from "react";
import { X } from "lucide-react";
import "./VillageAdministration.css";

const API_URL = import.meta.env.DEV ? "http://localhost:5000" : "https://panchayat-system.onrender.com";


export default function VillageAdministration({ user, onNavigate }) {
  const [officials, setOfficials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    position: "Ward Member",
    mobileNumber: "",
    address: "",
    photoPath: "",
    startDate: "",
    endDate: ""
  });

  const fetchOfficials = async () => {
    try {
      const response = await fetch(`${API_URL}/api/officials`);
      if (response.ok) {
        const data = await response.json();
        setOfficials(data);
      }
    } catch (err) {
      console.error("Failed to fetch officials", err);
    }
  };

  useEffect(() => {
    fetchOfficials();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openModal = (official = null) => {
    if (official) {
      setEditingId(official.id);
      setFormData({
        name: official.name,
        position: official.position,
        mobileNumber: official.mobileNumber,
        address: official.address,
        photoPath: official.photoPath,
        startDate: official.startDate.split('T')[0],
        endDate: official.endDate.split('T')[0]
      });
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        position: "Ward Member",
        mobileNumber: "",
        address: "",
        photoPath: "",
        startDate: "",
        endDate: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = editingId 
      ? `${API_URL}/api/officials/${editingId}`
      : `${API_URL}/api/officials`;
      
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Is-Admin": user.isAdmin ? "true" : "false"
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchOfficials();
        closeModal();
      } else {
        alert("Failed to save official. Make sure you are an admin.");
      }
    } catch (err) {
      console.error("Error saving official", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this official?")) return;

    try {
      const response = await fetch(`${API_URL}/api/officials/${id}`, {
        method: "DELETE",
        headers: {
          "X-Is-Admin": user.isAdmin ? "true" : "false"
        }
      });

      if (response.ok) {
        fetchOfficials();
      } else {
        alert("Failed to delete official. Make sure you are an admin.");
      }
    } catch (err) {
      console.error("Error deleting official", err);
    }
  };

  return (
    <div className="admin-module">
      <button className="back-to-home-btn" onClick={() => onNavigate("Menu")}>
        ← Back to Home
      </button>
      <div className="admin-header">
        <div className="header-text">
          <h2>Village Administration</h2>
          <p>Meet our dedicated panchayat officials and representatives.</p>
        </div>
        {user.isAdmin && (
          <button className="add-btn" onClick={() => openModal()}>
            + Add Official
          </button>
        )}
      </div>

      <div className="officials-grid">
        {officials.length === 0 ? (
          <p className="no-data">No officials found. Please check back later.</p>
        ) : (
          officials.map((official) => (
            <div className="official-card" key={official.id}>
              {user.isAdmin && (
                <div className="card-actions">
                  <button className="edit-icon" onClick={() => openModal(official)}>✏️</button>
                  <button className="delete-icon" onClick={() => handleDelete(official.id)}>🗑️</button>
                </div>
              )}
              <div className="photo-container">
                <img 
                  src={official.photoPath || "/default-avatar.png"} 
                  alt={official.name} 
                  className="official-photo"
                  onError={(e) => { e.target.src = "/default-avatar.png"; }}
                />
              </div>
              <h3 className="official-name">{official.name}</h3>
              <span className={`official-position pos-${official.position.replace(/\s+/g, '-').toLowerCase()}`}>
                {official.position}
              </span>
              
              <div className="official-details">
                <div className="detail-row">
                  <span className="icon">📞</span>
                  <span>{official.mobileNumber}</span>
                </div>
                <div className="detail-row">
                  <span className="icon">📍</span>
                  <span>{official.address}</span>
                </div>
                <div className="detail-row">
                  <span className="icon">🗓️</span>
                  <span>
                    {new Date(official.startDate).toLocaleDateString()} - 
                    {new Date(official.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-modal" 
              onClick={closeModal}
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s', padding: '5px' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
              title="Close"
            >
              <X size={22} color="#ff6b6b" />
            </button>
            <div style={{ marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#00d2ff' }}>{editingId ? "Edit Official" : "Add New Official"}</h2>
            </div>
            <form onSubmit={handleSubmit} className="official-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <select required name="position" value={formData.position} onChange={handleInputChange}>
                    <option value="President">President</option>
                    <option value="Vice President">Vice President</option>
                    <option value="Village Secretary">Village Secretary</option>
                    <option value="Ward Member">Ward Member</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>Photo URL/Path</label>
                  <input type="text" name="photoPath" value={formData.photoPath} onChange={handleInputChange} placeholder="/images/photo.jpg" />
                </div>
              </div>

              <div className="form-group">
                <label>Address</label>
                <textarea required name="address" value={formData.address} onChange={handleInputChange} rows="2"></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input required type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input required type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} />
                </div>
              </div>

              <button type="submit" className="submit-btn">
                {editingId ? "Save Changes" : "Add Official"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
