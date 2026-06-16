import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import './VillageEmployees.css';

const API_URL = import.meta.env.DEV ? "http://localhost:5000" : "https://panchayat-system.onrender.com";


function VillageEmployees({ user, onNavigate }) {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    designation: 'Electrician',
    mobileNumber: '',
    address: '',
    photoPath: ''
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_URL}/api/employees`);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openModal = (employee = null) => {
    if (employee) {
      setFormData(employee);
    } else {
      setFormData({
        id: null,
        name: '',
        designation: 'Electrician',
        mobileNumber: '',
        address: '',
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
      ? `${API_URL}/api/employees/${formData.id}`
      : `${API_URL}/api/employees`;
      
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
        fetchEmployees();
        closeModal();
      } else {
        console.error('Failed to save employee');
      }
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    
    try {
      const response = await fetch(`${API_URL}/api/employees/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Is-Admin': user?.isAdmin ? 'true' : 'false'
        }
      });

      if (response.ok) {
        fetchEmployees();
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const getDesignationClass = (designation) => {
    switch (designation) {
      case 'Electrician': return 'pos-electrician';
      case 'Water operator': return 'pos-water-operator';
      case 'Sanitary Worker': return 'pos-sanitary-worker';
      case 'Village Assistant': return 'pos-village-assistant';
      default: return 'pos-other';
    }
  };

  return (
    <div className="admin-module">
      <button className="back-to-home-btn" onClick={() => onNavigate("Menu")}>
        ← Back to Home
      </button>
      <div className="admin-header">
        {user.isAdmin && (
          <button className="add-btn" onClick={() => openModal()}>
            + Add Employee
          </button>
        )}
        <div className="header-text">
          <h2>Village Employees</h2>
          <p>Meet our hardworking staff keeping the village running.</p>
        </div>
      </div>

      <div className="officials-grid">
        {employees.length === 0 ? (
          <div className="no-data">No employees found.</div>
        ) : (
          employees.map(employee => (
            <div key={employee.id} className="official-card">
              {user.isAdmin && (
                <div className="card-actions">
                  <button className="edit-icon" onClick={() => openModal(employee)}>✏️</button>
                  <button className="delete-icon" onClick={() => handleDelete(employee.id)}>🗑️</button>
                </div>
              )}
              <div className="photo-container">
                <img 
                  src={employee.photoPath || "/default-avatar.png"} 
                  alt={employee.name} 
                  className="official-photo"
                  onError={(e) => { e.target.src = "/default-avatar.png"; }}
                />
              </div>
              <h3 className="official-name">{employee.name}</h3>
              <span className={`position-badge ${getDesignationClass(employee.designation)}`}>
                {employee.designation}
              </span>
              <div className="contact-info">
                <p>📞 {employee.mobileNumber}</p>
                <p>📍 {employee.address}</p>
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
              <h2 style={{ margin: 0, fontSize: '20px', color: '#00d2ff' }}>{formData.id ? 'Edit Employee' : 'Add New Employee'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="official-form">
              <div className="form-group">
                <label>Full Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label>Designation</label>
                <select required name="designation" value={formData.designation} onChange={handleInputChange}>
                  <option value="Electrician">Electrician</option>
                  <option value="Water operator">Water operator</option>
                  <option value="Sanitary Worker">Sanitary Worker</option>
                  <option value="Village Assistant">Village Assistant</option>
                  <option value="Other Employees">Other Employees</option>
                </select>
              </div>

              <div className="form-group">
                <label>Mobile Number</label>
                <input required type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} />
              </div>
              
              <div className="form-group">
                <label>Address</label>
                <textarea required name="address" value={formData.address} onChange={handleInputChange} rows="2"></textarea>
              </div>

              <div className="form-group">
                <label>Photo URL (Optional)</label>
                <input type="text" name="photoPath" value={formData.photoPath || ''} onChange={handleInputChange} />
              </div>

              <button type="submit" className="submit-btn">
                {formData.id ? 'Save Changes' : 'Add Employee'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default VillageEmployees;
