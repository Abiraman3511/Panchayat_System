import React, { useState, useEffect } from 'react';
import { ChevronRight, Home, Users, User, Search, Download, FileText, Briefcase, Calendar, MapPin, Plus, X, Edit2, Trash2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import './PeopleDirectory.css';

const PeopleDirectory = ({ user, onNavigate }) => {
  const [level, setLevel] = useState('STREETS'); // STREETS, FAMILIES, PEOPLE
  const [streets, setStreets] = useState([]);
  const [families, setFamilies] = useState([]);
  const [people, setPeople] = useState([]);
  
  const [selectedStreet, setSelectedStreet] = useState(null);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [selectedPersonDetail, setSelectedPersonDetail] = useState(null);
  const [isEditingPerson, setIsEditingPerson] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: null });

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Admin Modals State
  const [isStreetModalOpen, setIsStreetModalOpen] = useState(false);
  const [newStreetName, setNewStreetName] = useState('');
  
  const [isEditStreetModalOpen, setIsEditStreetModalOpen] = useState(false);
  const [editingStreetId, setEditingStreetId] = useState(null);
  const [editStreetName, setEditStreetName] = useState('');

  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [newFamily, setNewFamily] = useState({ familyHeadName: '', houseNumber: '', address: '' });
  
  const [isEditFamilyModalOpen, setIsEditFamilyModalOpen] = useState(false);
  const [editingFamilyId, setEditingFamilyId] = useState(null);
  const [editFamily, setEditFamily] = useState({ familyHeadName: '', houseNumber: '', address: '' });

  const [isPersonModalOpen, setIsPersonModalOpen] = useState(false);
  const [newPerson, setNewPerson] = useState({ 
    name: '', gender: 'Male', dateOfBirth: '', mobileNumber: '', 
    occupation: '', education: '', maritalStatus: 'Single', 
    caste: '',
    aadhaarNumber: '', voterId: '' 
  });

  const isAdmin = user?.isAdmin || false;
  const getAuthHeaders = () => isAdmin ? { 'X-Is-Admin': 'true', 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };

  useEffect(() => {
    fetchStreets();
  }, []);

  const fetchStreets = async () => {
    try {
      const response = await fetch('https://panchayat-system.onrender.com/api/streets');
      if (response.ok) {
        setStreets(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch streets', error);
    }
  };

  const fetchFamilies = async (streetId) => {
    try {
      const response = await fetch(`https://panchayat-system.onrender.com/api/streets/${streetId}/families`);
      if (response.ok) {
        setFamilies(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch families', error);
    }
  };

  const fetchPeopleInFamily = async (familyId) => {
    try {
      const headers = isAdmin ? { 'X-Is-Admin': 'true' } : {};
      const response = await fetch(`https://panchayat-system.onrender.com/api/families/${familyId}/people`, { headers });
      if (response.ok) {
        setPeople(await response.json());
      }
    } catch (error) {
      console.error('Failed to fetch people', error);
    }
  };

  const handleGlobalSearch = async () => {
    if (!searchQuery) {
      setIsSearching(false);
      setLevel('STREETS');
      return;
    }

    setIsSearching(true);
    setLevel('SEARCH_RESULTS');
    
    let url = new URL('https://panchayat-system.onrender.com/api/people/search');
    url.searchParams.append('query', searchQuery);

    try {
      const headers = isAdmin ? { 'X-Is-Admin': 'true' } : {};
      const response = await fetch(url, { headers });
      if (response.ok) {
        setPeople(await response.json());
      }
    } catch (error) {
      console.error('Failed to search people', error);
    }
  };

  // --- ADMIN ADD FUNCTIONS ---

  const handleAddStreet = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://panchayat-system.onrender.com/api/streets', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: newStreetName })
      });
      if (res.ok) {
        setIsStreetModalOpen(false);
        setNewStreetName('');
        fetchStreets();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditStreetModal = (street, e) => {
    e.stopPropagation();
    setEditingStreetId(street.id);
    setEditStreetName(street.name);
    setIsEditStreetModalOpen(true);
  };

  const handleEditStreetSubmit = async (e) => {
    e.preventDefault();
    setConfirmDialog({
      isOpen: true,
      message: `Are you sure you want to save these changes to "${editStreetName}"?`,
      onConfirm: async () => {
        try {
          const res = await fetch(`https://panchayat-system.onrender.com/api/streets/${editingStreetId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ id: editingStreetId, name: editStreetName })
          });
          if (res.ok) {
            setIsEditStreetModalOpen(false);
            setEditingStreetId(null);
            setEditStreetName('');
            fetchStreets();
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const handleDeleteStreet = (street, e) => {
    e.stopPropagation();
    setConfirmDialog({
      isOpen: true,
      message: `Are you sure you want to delete "${street.name}"?`,
      onConfirm: async () => {
        try {
          const res = await fetch(`https://panchayat-system.onrender.com/api/streets/${street.id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
          });
          if (res.ok) {
            if (selectedStreet && selectedStreet.id === street.id) {
              setLevel('STREETS');
              setSelectedStreet(null);
            }
            fetchStreets();
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const handleAddFamily = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://panchayat-system.onrender.com/api/streets/${selectedStreet.id}/families`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newFamily)
      });
      if (res.ok) {
        setIsFamilyModalOpen(false);
        setNewFamily({ familyHeadName: '', houseNumber: '', address: '' });
        fetchFamilies(selectedStreet.id);
        fetchStreets(); // Update counts
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openEditFamilyModal = (family, e) => {
    e.stopPropagation();
    setEditingFamilyId(family.id);
    setEditFamily({
      familyHeadName: family.familyHeadName,
      houseNumber: family.houseNumber,
      address: family.address
    });
    setIsEditFamilyModalOpen(true);
  };

  const handleEditFamilySubmit = async (e) => {
    e.preventDefault();
    setConfirmDialog({
      isOpen: true,
      message: `Are you sure you want to save changes to ${editFamily.familyHeadName}'s Family?`,
      onConfirm: async () => {
        try {
          const res = await fetch(`https://panchayat-system.onrender.com/api/families/${editingFamilyId}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({ id: editingFamilyId, ...editFamily })
          });
          if (res.ok) {
            setIsEditFamilyModalOpen(false);
            setEditingFamilyId(null);
            setEditFamily({ familyHeadName: '', houseNumber: '', address: '' });
            if (selectedStreet) fetchFamilies(selectedStreet.id);
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const handleDeleteFamily = (family, e) => {
    e.stopPropagation();
    setConfirmDialog({
      isOpen: true,
      message: `Are you sure you want to delete ${family.familyHeadName}'s Family?`,
      onConfirm: async () => {
        try {
          const res = await fetch(`https://panchayat-system.onrender.com/api/families/${family.id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
          });
          if (res.ok) {
            if (selectedFamily && selectedFamily.id === family.id) {
              setLevel('FAMILIES');
              setSelectedFamily(null);
            }
            if (selectedStreet) fetchFamilies(selectedStreet.id);
            fetchStreets(); // update count
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const handleAddPerson = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`https://panchayat-system.onrender.com/api/families/${selectedFamily.id}/people`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newPerson)
      });
      if (res.ok) {
        setIsPersonModalOpen(false);
        setNewPerson({ 
          name: '', gender: 'Male', dateOfBirth: '', mobileNumber: '', 
          occupation: '', education: '', maritalStatus: 'Single', 
          caste: '',
          aadhaarNumber: '', voterId: '',
          presentAddress: '', permanentAddress: ''
        });
        fetchPeopleInFamily(selectedFamily.id);
        fetchFamilies(selectedStreet.id); // Update counts
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditPerson = async () => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to save these changes?',
      onConfirm: async () => {
        try {
          const res = await fetch(`https://panchayat-system.onrender.com/api/people/${selectedPersonDetail.id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(selectedPersonDetail)
          });
          if (res.ok) {
            const updatedPerson = await res.json();
            setSelectedPersonDetail(prev => ({ ...prev, ...updatedPerson }));
            setIsEditingPerson(false);
            if (selectedFamily) fetchPeopleInFamily(selectedFamily.id);
            else if (isSearching) handleGlobalSearch();
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const handleDeletePerson = async () => {
    setConfirmDialog({
      isOpen: true,
      message: 'Are you sure you want to delete this person?',
      onConfirm: async () => {
        try {
          const res = await fetch(`https://panchayat-system.onrender.com/api/people/${selectedPersonDetail.id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
          });
          if (res.ok) {
            setSelectedPersonDetail(null);
            setIsEditingPerson(false);
            if (selectedFamily) {
              fetchPeopleInFamily(selectedFamily.id);
              if (selectedStreet) fetchFamilies(selectedStreet.id);
            }
            else if (isSearching) handleGlobalSearch();
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`https://panchayat-system.onrender.com/api/people/${selectedPersonDetail.id}/upload-photo`, {
        method: "POST",
        headers: {
          "X-Is-Admin": "true"
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedPersonDetail(prev => ({ ...prev, photoPath: data.photoPath }));
        
        // Refresh the list
        if (selectedFamily) fetchPeopleInFamily(selectedFamily.id);
        else if (isSearching) handleGlobalSearch();
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to upload photo");
      }
    } catch (err) {
      console.error("Photo upload error", err);
      alert("Error uploading photo.");
    }
  };


  const handleStreetClick = (street) => {
    setSelectedStreet(street);
    fetchFamilies(street.id);
    setLevel('FAMILIES');
  };

  const handleFamilyClick = (family) => {
    setSelectedFamily(family);
    fetchPeopleInFamily(family.id);
    setLevel('PEOPLE');
  };

  const navigateTo = (targetLevel) => {
    setIsSearching(false);
    setSearchQuery('');
    setLevel(targetLevel);
    if (targetLevel === 'STREETS') {
      setSelectedStreet(null);
      setSelectedFamily(null);
    } else if (targetLevel === 'FAMILIES') {
      setSelectedFamily(null);
    }
  };

  const handleBackNavigation = () => {
    if (level === 'PEOPLE') {
      navigateTo('FAMILIES');
    } else if (level === 'FAMILIES') {
      navigateTo('STREETS');
    } else if (level === 'SEARCH_RESULTS') {
      navigateTo('STREETS');
    } else {
      onNavigate("Menu");
    }
  };

  const getBackButtonText = () => {
    if (level === 'PEOPLE') return "← Back to Families";
    if (level === 'FAMILIES') return "← Back to Streets";
    if (level === 'SEARCH_RESULTS') return "← Back to Directory";
    return "← Back to Home";
  };

  // Export Functions
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Panchayat People Directory', 14, 15);
    
    const tableColumn = ["Name", "Gender", "Age", "Mobile", "Occupation", "Caste", "Education"];
    if (isAdmin) {
      tableColumn.push("Aadhaar", "Voter ID");
    }

    const tableRows = [];
    people.forEach(person => {
      const personData = [
        person.name, person.gender, person.age, person.mobileNumber, person.occupation, person.caste, person.education
      ];
      if (isAdmin) {
        personData.push(person.aadhaarNumber || 'N/A', person.voterId || 'N/A');
      }
      tableRows.push(personData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    doc.save(`People_Directory_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportToExcel = () => {
    let exportData = people.map(p => {
      let row = {
        Name: p.name,
        Gender: p.gender,
        Age: p.age,
        Mobile: p.mobileNumber,
        Occupation: p.occupation,
        Caste: p.caste,
        Education: p.education,
        MaritalStatus: p.maritalStatus
      };
      if (isAdmin) {
        row.Aadhaar = p.aadhaarNumber || 'N/A';
        row.VoterID = p.voterId || 'N/A';
      }
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "People");
    XLSX.writeFile(workbook, `People_Directory_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="people-directory-container">
      <button className="back-to-home-btn" onClick={handleBackNavigation}>
        {getBackButtonText()}
      </button>
      <div className="directory-header">
        <h1 className="directory-title">People Directory</h1>
        <p>Comprehensive register of all village citizens</p>
      </div>

      <div className="breadcrumb-nav">
        <div className={`breadcrumb-item ${level === 'STREETS' && !isSearching ? 'active' : ''}`} onClick={() => navigateTo('STREETS')}>
          Village Streets
        </div>
        
        {selectedStreet && !isSearching && (
          <>
            <ChevronRight className="breadcrumb-separator" size={20} />
            <div className={`breadcrumb-item ${level === 'FAMILIES' ? 'active' : ''}`} onClick={() => navigateTo('FAMILIES')}>
              {selectedStreet.name}
            </div>
          </>
        )}

        {selectedFamily && !isSearching && (
          <>
            <ChevronRight className="breadcrumb-separator" size={20} />
            <div className={`breadcrumb-item ${level === 'PEOPLE' ? 'active' : ''}`}>
              {selectedFamily.familyHeadName}'s Family
            </div>
          </>
        )}

        {isSearching && (
          <>
            <ChevronRight className="breadcrumb-separator" size={20} />
            <div className="breadcrumb-item active">Search Results</div>
          </>
        )}
      </div>

      <div className="actions-bar">
        <div className="search-filter-group">
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="premium-input search-input-large"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{flex: 1}}
          />
          <button className="btn-export" style={{background: 'var(--primary-light)', borderColor: 'var(--primary)', color: 'var(--primary)', padding: '15px 30px', fontSize: '1.1rem'}} onClick={handleGlobalSearch}>
            <Search size={22} /> Search
          </button>
        </div>

        <div className="export-group">
          {level === 'STREETS' && isAdmin && !isSearching && (
            <button className="btn-add" onClick={() => setIsStreetModalOpen(true)}>
              <Plus size={18} /> Add Street
            </button>
          )}
          {level === 'FAMILIES' && isAdmin && !isSearching && (
            <button className="btn-add" onClick={() => setIsFamilyModalOpen(true)}>
              <Plus size={18} /> Add Family
            </button>
          )}
          {level === 'PEOPLE' && isAdmin && !isSearching && (
            <button className="btn-add" onClick={() => setIsPersonModalOpen(true)}>
              <Plus size={18} /> Add Person
            </button>
          )}

          {(level === 'PEOPLE' || level === 'SEARCH_RESULTS') && people.length > 0 && isAdmin && (
            <>
              <button className="btn-export pdf" onClick={exportToPDF}>
                <FileText size={18} /> PDF
              </button>
              <button className="btn-export excel" onClick={exportToExcel}>
                <Download size={18} /> Excel
              </button>
            </>
          )}
        </div>
      </div>

      {level === 'STREETS' && (
        <div className="grid-container">
          {streets.map(street => (
            <div key={street.id} className="glass-card" onClick={() => handleStreetClick(street)}>
              <div className="card-icon-wrapper">
                <MapPin size={28} />
              </div>
              <h3 className="card-title">{street.name}</h3>
              <div className="card-stat">
                <Home size={16} />
                <span>{street.familyCount} Families</span>
              </div>
              {isAdmin && (
                <div style={{position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px'}}>
                  <button className="icon-btn-small" onClick={(e) => openEditStreetModal(street, e)} title="Edit Street" style={{background: 'var(--bg-main)', border: '1px solid var(--border)', cursor: 'pointer', padding: '5px', borderRadius: '4px', color: 'var(--secondary)'}}>
                    <Edit2 size={14} />
                  </button>
                  <button className="icon-btn-small" onClick={(e) => handleDeleteStreet(street, e)} title="Delete Street" style={{background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', padding: '5px', borderRadius: '4px', color: 'var(--danger)'}}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
          {streets.length === 0 && <p style={{textAlign: 'center', width: '100%'}}>No streets available.</p>}
        </div>
      )}

      {level === 'FAMILIES' && (
        <div className="grid-container">
          {families.map(family => (
            <div key={family.id} className="glass-card" onClick={() => handleFamilyClick(family)}>
              <div className="card-icon-wrapper" style={{color: 'var(--primary)', borderColor: 'var(--primary-light)', background: 'var(--primary-light)'}}>
                <Users size={28} />
              </div>
              <h3 className="card-title">{family.familyHeadName}'s Family</h3>
              <div className="card-stat">
                <Home size={16} />
                <span>House No: {family.houseNumber}</span>
              </div>
              <div className="card-stat">
                <User size={16} />
                <span>{family.peopleCount} Members</span>
              </div>
              {isAdmin && (
                <div style={{position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px'}}>
                  <button className="icon-btn-small" onClick={(e) => openEditFamilyModal(family, e)} title="Edit Family" style={{background: 'var(--bg-main)', border: '1px solid var(--border)', cursor: 'pointer', padding: '5px', borderRadius: '4px', color: 'var(--secondary)'}}>
                    <Edit2 size={14} />
                  </button>
                  <button className="icon-btn-small" onClick={(e) => handleDeleteFamily(family, e)} title="Delete Family" style={{background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', padding: '5px', borderRadius: '4px', color: 'var(--danger)'}}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ))}
          {families.length === 0 && <p style={{textAlign: 'center', width: '100%'}}>No families found in this street.</p>}
        </div>
      )}

      {(level === 'PEOPLE' || level === 'SEARCH_RESULTS') && (
        <div className="people-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Age</th>
                <th>Occupation</th>
                <th>Caste</th>
                <th>Mobile</th>
                {isAdmin && <th>Aadhaar / Voter ID</th>}
              </tr>
            </thead>
            <tbody>
              {people.map(person => (
                <tr 
                  key={person.id} 
                  onClick={() => setSelectedPersonDetail(person)}
                  style={{cursor: 'pointer'}}
                >
                  <td>
                    <div style={{fontWeight: 600, color: 'var(--secondary)'}}>{person.name}</div>
                    <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>{person.education}</div>
                  </td>
                  <td>
                    <span className={`badge ${person.gender.toLowerCase()}`}>{person.gender}</span>
                  </td>
                  <td>{person.age}</td>
                  <td>{person.occupation}</td>
                  <td>{person.caste}</td>
                  <td>{person.mobileNumber}</td>
                  {isAdmin && (
                    <td>
                      <div className="secret-field">Aadhaar: {person.aadhaarNumber}</div>
                      <div className="secret-field">Voter: {person.voterId}</div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {people.length === 0 && <p style={{textAlign: 'center', padding: '30px'}}>No people found.</p>}
        </div>
      )}

      {/* --- MODALS --- */}
      {/* Person Detail Modal */}
      {selectedPersonDetail && (
        <div className="modal-overlay" onClick={() => setSelectedPersonDetail(null)}>
          <div className="modal-content glass-panel profile-modal" onClick={e => e.stopPropagation()}>
            <div className="profile-header" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', paddingBottom: '10px' }}>
              <div className="profile-photo" style={{ justifySelf: 'start', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
                {selectedPersonDetail.photoPath ? (
                  <img src={`https://panchayat-system.onrender.com${selectedPersonDetail.photoPath}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <User size={35} color="var(--primary)" />
                )}
                {isEditingPerson && (
                  <>
                    <label htmlFor="photo-upload" style={{ position: 'absolute', bottom: 0, background: 'rgba(0,0,0,0.6)', width: '100%', textAlign: 'center', fontSize: '10px', cursor: 'pointer', padding: '2px 0', color: '#fff' }}>
                      Upload
                    </label>
                    <input 
                      id="photo-upload" 
                      type="file" 
                      accept=".jpg,.jpeg,.png" 
                      style={{ display: 'none' }} 
                      onChange={handlePhotoUpload} 
                    />
                  </>
                )}
              </div>
              <div className="profile-title" style={{ justifySelf: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                {isEditingPerson ? (
                  <input type="text" className="premium-input" value={selectedPersonDetail.name} onChange={e => setSelectedPersonDetail({...selectedPersonDetail, name: e.target.value})} style={{fontSize: '1.2rem', textAlign: 'center', width: '100%'}}/>
                ) : (
                  <h2 style={{ margin: 0 }}>{selectedPersonDetail.name}</h2>
                )}
                <div className={`badge ${selectedPersonDetail.gender.toLowerCase()}`}>
                  {selectedPersonDetail.gender} • {selectedPersonDetail.age} Years
                </div>
              </div>
              <button 
                onClick={() => { setSelectedPersonDetail(null); setIsEditingPerson(false); }}
                style={{ justifySelf: 'end', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s', padding: '5px', display: 'flex', alignItems: 'center' }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
                title="Close"
              >
                <X size={28} color="var(--danger)" />
              </button>
            </div>

            {isEditingPerson ? (
              <div className="profile-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Gender</span>
                  <select className="premium-input" value={selectedPersonDetail.gender} onChange={e => setSelectedPersonDetail({...selectedPersonDetail, gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date of Birth</span>
                  <input type="date" className="premium-input" value={selectedPersonDetail.dateOfBirth.split('T')[0]} onChange={e => setSelectedPersonDetail({...selectedPersonDetail, dateOfBirth: e.target.value})} />
                </div>
                <div className="detail-item">
                  <span className="detail-label">Occupation</span>
                  <input type="text" className="premium-input" value={selectedPersonDetail.occupation} onChange={e => setSelectedPersonDetail({...selectedPersonDetail, occupation: e.target.value})} />
                </div>
                <div className="detail-item">
                  <span className="detail-label">Education</span>
                  <input type="text" className="premium-input" value={selectedPersonDetail.education} onChange={e => setSelectedPersonDetail({...selectedPersonDetail, education: e.target.value})} />
                </div>
                <div className="detail-item">
                  <span className="detail-label">Caste</span>
                  <input type="text" className="premium-input" value={selectedPersonDetail.caste} onChange={e => setSelectedPersonDetail({...selectedPersonDetail, caste: e.target.value})} />
                </div>
                <div className="detail-item">
                  <span className="detail-label">Marital Status</span>
                  <select className="premium-input" value={selectedPersonDetail.maritalStatus} onChange={e => setSelectedPersonDetail({...selectedPersonDetail, maritalStatus: e.target.value})}>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Mobile</span>
                  <input type="text" className="premium-input" value={selectedPersonDetail.mobileNumber} onChange={e => setSelectedPersonDetail({...selectedPersonDetail, mobileNumber: e.target.value})} />
                </div>
                <div className="detail-item" style={{gridColumn: 'span 2', background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '8px', borderRadius: '6px'}}>
                  <span className="detail-label">Present Address</span>
                  <input type="text" className="premium-input" style={{fontSize: '0.85rem', marginTop: '5px'}} value={selectedPersonDetail.presentAddress || ''} onChange={e => setSelectedPersonDetail({...selectedPersonDetail, presentAddress: e.target.value})} placeholder="Leave blank to use Family Address" />
                </div>
                <div className="detail-item" style={{gridColumn: 'span 2', background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '8px', borderRadius: '6px'}}>
                  <span className="detail-label">Permanent Address</span>
                  <input type="text" className="premium-input" style={{fontSize: '0.85rem', marginTop: '5px'}} value={selectedPersonDetail.permanentAddress || ''} onChange={e => setSelectedPersonDetail({...selectedPersonDetail, permanentAddress: e.target.value})} />
                </div>
                <div className="detail-item admin-detail">
                  <span className="detail-label">Aadhaar Number</span>
                  <input type="text" className="premium-input" value={selectedPersonDetail.aadhaarNumber || ''} onChange={e => setSelectedPersonDetail({...selectedPersonDetail, aadhaarNumber: e.target.value})} />
                </div>
                <div className="detail-item admin-detail">
                  <span className="detail-label">Voter ID</span>
                  <input type="text" className="premium-input" value={selectedPersonDetail.voterId || ''} onChange={e => setSelectedPersonDetail({...selectedPersonDetail, voterId: e.target.value})} />
                </div>
              </div>
            ) : (
              <div className="profile-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Occupation</span>
                  <span className="detail-value">{selectedPersonDetail.occupation}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Education</span>
                  <span className="detail-value">{selectedPersonDetail.education}</span>
                </div>
              <div className="detail-item">
                <span className="detail-label">Caste</span>
                <span className="detail-value">{selectedPersonDetail.caste}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Marital Status</span>
                <span className="detail-value">{selectedPersonDetail.maritalStatus}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Mobile</span>
                <span className="detail-value">{selectedPersonDetail.mobileNumber}</span>
              </div>
              <div className="detail-item" style={{gridColumn: 'span 2', background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '8px', borderRadius: '6px'}}>
                <span className="detail-label">Present Address</span>
                <span className="detail-value" style={{fontSize: '0.85rem'}}>
                  {selectedPersonDetail.presentAddress ? selectedPersonDetail.presentAddress : (selectedFamily ? `${selectedFamily.houseNumber ? selectedFamily.houseNumber + ', ' : ''}${selectedFamily.address}, ${selectedStreet?.name}` : `${selectedPersonDetail.address}, ${selectedPersonDetail.streetName}`)}
                </span>
              </div>
              <div className="detail-item" style={{gridColumn: 'span 2', background: 'var(--bg-main)', border: '1px solid var(--border)', padding: '8px', borderRadius: '6px'}}>
                <span className="detail-label">Permanent Address</span>
                <span className="detail-value" style={{fontSize: '0.85rem'}}>
                  {selectedPersonDetail.permanentAddress || 'N/A'}
                </span>
              </div>
              {isAdmin && (
                <>
                  <div className="detail-item admin-detail">
                    <span className="detail-label">Aadhaar Number</span>
                    <span className="detail-value">{selectedPersonDetail.aadhaarNumber || 'N/A'}</span>
                  </div>
                  <div className="detail-item admin-detail">
                    <span className="detail-label">Voter ID</span>
                    <span className="detail-value">{selectedPersonDetail.voterId || 'N/A'}</span>
                  </div>
                </>
              )}
            </div>
            )}

            <div style={{display: 'flex', gap: '10px', marginTop: '15px'}}>
              {isEditingPerson ? (
                <>
                  <button 
                    className="btn-export" 
                    style={{flex: 1, justifyContent: 'center', background: 'var(--primary)', color: 'white', border: 'none'}} 
                    onClick={handleEditPerson}
                  >
                    Save
                  </button>
                  <button 
                    className="btn-export" 
                    style={{flex: 1, justifyContent: 'center', background: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border-strong)'}} 
                    onClick={() => setIsEditingPerson(false)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  {isAdmin && (
                    <>
                      <button 
                        className="btn-export" 
                        style={{flex: 1, justifyContent: 'center', background: 'var(--primary)', color: 'white', border: 'none'}} 
                        onClick={() => setIsEditingPerson(true)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn-export" 
                        style={{flex: 1, justifyContent: 'center', background: 'var(--danger)', color: 'white', border: 'none'}} 
                        onClick={handleDeletePerson}
                      >
                        Delete
                      </button>
                    </>
                  )}
                  <button 
                    className="btn-export" 
                    style={{flex: 1, justifyContent: 'center', background: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border-strong)'}} 
                    onClick={() => {
                      setSelectedPersonDetail(null);
                      setIsEditingPerson(false);
                    }}
                  >
                    Back
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isStreetModalOpen && (
        <div className="modal-overlay" onClick={() => setIsStreetModalOpen(false)}>
          <div className="modal-content compact-modal" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsStreetModalOpen(false)} 
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s', padding: '5px' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
            >
              <X size={22} color="#ff6b6b" />
            </button>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#00d2ff', marginBottom: '15px' }}>Add New Street</h2>
            <form onSubmit={handleAddStreet}>
              <div className="form-group">
                <label>Street Name</label>
                <input type="text" className="premium-input" required value={newStreetName} onChange={e => setNewStreetName(e.target.value)} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsStreetModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Add Street</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditStreetModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditStreetModalOpen(false)}>
          <div className="modal-content compact-modal" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsEditStreetModalOpen(false)} 
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s', padding: '5px' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
            >
              <X size={22} color="#ff6b6b" />
            </button>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#00d2ff', marginBottom: '15px' }}>Edit Street Name</h2>
            <form onSubmit={handleEditStreetSubmit}>
              <div className="form-group">
                <label>Street Name</label>
                <input type="text" className="premium-input" required value={editStreetName} onChange={e => setEditStreetName(e.target.value)} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsEditStreetModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isFamilyModalOpen && (
        <div className="modal-overlay" onClick={() => setIsFamilyModalOpen(false)}>
          <div className="modal-content compact-modal" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsFamilyModalOpen(false)} 
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s', padding: '5px' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
            >
              <X size={22} color="#ff6b6b" />
            </button>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#00d2ff', marginBottom: '15px' }}>Add New Family to {selectedStreet?.name}</h2>
            <form onSubmit={handleAddFamily}>
              <div className="form-group">
                <label>Family Head Name</label>
                <input type="text" className="premium-input" required value={newFamily.familyHeadName} onChange={e => setNewFamily({...newFamily, familyHeadName: e.target.value})} />
              </div>
              <div className="form-group">
                <label>House Number</label>
                <input type="text" className="premium-input" required value={newFamily.houseNumber} onChange={e => setNewFamily({...newFamily, houseNumber: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Full Address</label>
                <input type="text" className="premium-input" required value={newFamily.address} onChange={e => setNewFamily({...newFamily, address: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsFamilyModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Add Family</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isEditFamilyModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditFamilyModalOpen(false)}>
          <div className="modal-content compact-modal" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsEditFamilyModalOpen(false)} 
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s', padding: '5px' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
            >
              <X size={22} color="#ff6b6b" />
            </button>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#00d2ff', marginBottom: '15px' }}>Edit Family</h2>
            <form onSubmit={handleEditFamilySubmit}>
              <div className="form-group">
                <label>Family Head Name</label>
                <input type="text" className="premium-input" required value={editFamily.familyHeadName} onChange={e => setEditFamily({...editFamily, familyHeadName: e.target.value})} />
              </div>
              <div className="form-group">
                <label>House Number</label>
                <input type="text" className="premium-input" required value={editFamily.houseNumber} onChange={e => setEditFamily({...editFamily, houseNumber: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input type="text" className="premium-input" required value={editFamily.address} onChange={e => setEditFamily({...editFamily, address: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsEditFamilyModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPersonModalOpen && (
        <div className="modal-overlay" onClick={() => setIsPersonModalOpen(false)}>
          <div className="modal-content compact-modal" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsPersonModalOpen(false)} 
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s', padding: '5px' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
            >
              <X size={22} color="#ff6b6b" />
            </button>
            <h2 style={{ margin: 0, fontSize: '20px', color: '#00d2ff', marginBottom: '15px' }}>Add Person to {selectedFamily?.familyHeadName}'s Family</h2>
            <form onSubmit={handleAddPerson}>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" className="premium-input" required value={newPerson.name} onChange={e => setNewPerson({...newPerson, name: e.target.value})} />
              </div>
              <div style={{display: 'flex', gap: '15px'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Gender</label>
                  <select className="premium-select" value={newPerson.gender} onChange={e => setNewPerson({...newPerson, gender: e.target.value})}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>Date of Birth</label>
                  <input type="date" className="premium-input" required value={newPerson.dateOfBirth} onChange={e => setNewPerson({...newPerson, dateOfBirth: e.target.value})} />
                </div>
              </div>
              <div style={{display: 'flex', gap: '15px'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Mobile Number</label>
                  <input type="text" className="premium-input" value={newPerson.mobileNumber} onChange={e => setNewPerson({...newPerson, mobileNumber: e.target.value})} />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>Occupation</label>
                  <input type="text" className="premium-input" value={newPerson.occupation} onChange={e => setNewPerson({...newPerson, occupation: e.target.value})} />
                </div>
              </div>
              <div style={{display: 'flex', gap: '15px'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Education</label>
                  <input type="text" className="premium-input" value={newPerson.education} onChange={e => setNewPerson({...newPerson, education: e.target.value})} />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>Caste</label>
                  <input type="text" className="premium-input" value={newPerson.caste} onChange={e => setNewPerson({...newPerson, caste: e.target.value})} />
                </div>
              </div>
              <div style={{display: 'flex', gap: '15px'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Marital Status</label>
                  <select className="premium-select" value={newPerson.maritalStatus} onChange={e => setNewPerson({...newPerson, maritalStatus: e.target.value})}>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>
              <div style={{display: 'flex', gap: '15px'}}>
                <div className="form-group" style={{flex: 1}}>
                  <label>Aadhaar Number (Admin)</label>
                  <input type="text" className="premium-input" value={newPerson.aadhaarNumber} onChange={e => setNewPerson({...newPerson, aadhaarNumber: e.target.value})} />
                </div>
                <div className="form-group" style={{flex: 1}}>
                  <label>Voter ID (Admin)</label>
                  <input type="text" className="premium-input" value={newPerson.voterId} onChange={e => setNewPerson({...newPerson, voterId: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Present Address (Leave blank for Family Addr)</label>
                <input type="text" className="premium-input" value={newPerson.presentAddress} onChange={e => setNewPerson({...newPerson, presentAddress: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Permanent Address</label>
                <input type="text" className="premium-input" value={newPerson.permanentAddress} onChange={e => setNewPerson({...newPerson, permanentAddress: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setIsPersonModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-submit">Save Person</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmDialog.isOpen && (
        <div className="modal-overlay" style={{zIndex: 2000}} onClick={() => setConfirmDialog({ isOpen: false, message: '', onConfirm: null })}>
          <div className="modal-content profile-modal" style={{textAlign: 'center', maxWidth: '300px', background: 'var(--bg-card)'}} onClick={e => e.stopPropagation()}>
            <h3 style={{color: 'var(--secondary)', marginTop: '10px', marginBottom: '20px', fontSize: '1.2rem', fontWeight: '600'}}>{confirmDialog.message}</h3>
            <div style={{display: 'flex', gap: '10px'}}>
              <button 
                className="btn-export" 
                style={{flex: 1, justifyContent: 'center', background: 'var(--primary)', color: 'white', border: 'none'}} 
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
                }}
              >
                Yes
              </button>
              <button 
                className="btn-export" 
                style={{flex: 1, justifyContent: 'center', background: 'var(--bg-main)', color: 'var(--text-main)', border: '1px solid var(--border-strong)'}} 
                onClick={() => setConfirmDialog({ isOpen: false, message: '', onConfirm: null })}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PeopleDirectory;
