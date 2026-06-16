import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './GovernmentAdministration.css';

const API_URL = import.meta.env.DEV ? "http://localhost:5000" : "https://panchayat-system.onrender.com";


function GovernmentAdministration({ user, onNavigate }) {
  const [officials, setOfficials] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    position: 'District Collector',
    photoPath: ''
  });

  useEffect(() => {
    fetchOfficials();
  }, []);

  const fetchOfficials = async () => {
    try {
      const response = await fetch(`${API_URL}/api/government-officials`);
      const data = await response.json();
      setOfficials(data);
    } catch (error) {
      console.error('Failed to fetch government officials:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (official = null) => {
    if (official) {
      setFormData(official);
    } else {
      setFormData({
        id: null,
        name: '',
        position: 'District Collector',
        photoPath: ''
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = formData.id 
      ? `${API_URL}/api/government-officials/${formData.id}`
      : `${API_URL}/api/government-officials`;
      
    const method = formData.id ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'X-Is-Admin': user?.isAdmin ? 'true' : 'false'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchOfficials();
        closeModal();
      } else {
        console.error('Failed to save official');
      }
    } catch (error) {
      console.error('Error saving official:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this official?")) return;
    
    try {
      const response = await fetch(`${API_URL}/api/government-officials/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Is-Admin': user?.isAdmin ? 'true' : 'false'
        }
      });

      if (response.ok) {
        fetchOfficials();
      }
    } catch (error) {
      console.error('Error deleting official:', error);
    }
  };

  const getPositionClass = (position) => {
    return 'pos-' + position.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  };

  return (
    <div className="admin-module">
      <button className="back-to-home-btn" onClick={() => onNavigate("Menu")}>
        ← Back to Home
      </button>
      <div className="admin-header">
        {user.isAdmin && (
          <button className="add-btn" onClick={() => openModal()}>
            + Add Official
          </button>
        )}
        <div className="header-text">
          <h2>Government Administration</h2>
          <p>Meet the higher level government administrators and officers.</p>
        </div>
      </div>

      <div className="officials-grid">
        {officials.length === 0 ? (
          <div className="no-data">No officials found.</div>
        ) : (
          officials.map(official => (
            <div key={official.id} className="official-card">
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
              <span className={`position-badge ${getPositionClass(official.position)}`}>
                {official.position}
              </span>
              <h3 className="official-name">{official.name}</h3>
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
              <h2 style={{ margin: 0, fontSize: '20px', color: '#00d2ff' }}>{formData.id ? 'Edit Official' : 'Add New Official'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="official-form">
              <div className="form-group">
                <label>Full Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label>Position</label>
                <select required name="position" value={formData.position} onChange={handleInputChange}>
                  <option value="District Collector">District Collector</option>
                  <option value="District Revenue Officer">District Revenue Officer</option>
                  <option value="Revenue Divisional Officer">Revenue Divisional Officer</option>
                  <option value="Tahsildar">Tahsildar</option>
                  <option value="Deputy Tahsildar">Deputy Tahsildar</option>
                  <option value="Revenue Inspector">Revenue Inspector</option>
                  <option value="Village Administrative Officer (VAO)">Village Administrative Officer (VAO)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Photo URL (Optional)</label>
                <input type="text" name="photoPath" value={formData.photoPath || ''} onChange={handleInputChange} />
              </div>

              <button type="submit" className="submit-btn">
                {formData.id ? 'Save Changes' : 'Add Official'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default GovernmentAdministration;
