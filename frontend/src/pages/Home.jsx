import { useState } from "react";
import { X } from "lucide-react";
import "./Home.css";
import ProfileSidebar from "../components/ProfileSidebar";
import Dashboard from "../components/Dashboard";
import GovernmentAdministration from "../components/GovernmentAdministration";
import VillageAdministration from "../components/VillageAdministration";
import VillageEmployees from "../components/VillageEmployees";
import PeopleDirectory from "../components/PeopleDirectory";
import AboutVillage from "../components/AboutVillage";
import Footer from "../components/Footer";
import navLogo from "../assets/nav-logo.jpg";

export default function Home({ user, onLogout }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [activeModule, setActiveModule] = useState("Menu");

  const cards = [
    { id: "Dashboard", title: "Dashboard", icon: "📊", description: "View system overview and statistics" },
    { id: "Government Administration", title: "Government Administration", icon: "🏛️", description: "Meet the higher level government administrators" },
    { id: "Village Administration", title: "Village Administration", icon: "🏛️", description: "Manage panchayat policies and administrative tasks" },
    { id: "Village Employees", title: "Village Employees", icon: "👨‍💼", description: "Manage staff, roles, and payroll information" },
    { id: "People Directory", title: "People Directory", icon: "👥", description: "Search and manage the village citizen database" },
    { id: "Government Schemes", title: "Government Schemes", icon: "📜", description: "Track and apply for state and central schemes" },
    { id: "Village Events", title: "Village Events", icon: "🎉", description: "Schedule and manage upcoming community events" },
    { id: "About Village", title: "About Village", icon: "ℹ️", description: "Update village history, demographics, and public info" },
  ];

  return (
    <div className="home-container">
      <div className="navbar">
        <div className="nav-left">
          <img src={navLogo} alt="Village Logo" className="nav-logo" />
          <h1>KKM Panchayat system</h1>
        </div>
        <div className="nav-center">
          <a href="#" onClick={(e) => { e.preventDefault(); setActiveModule("Menu"); }} className={`nav-link ${activeModule === "Menu" ? "active" : ""}`}>Home</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsAboutOpen(true); }} className="nav-link">About</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsServicesOpen(true); }} className="nav-link">Service</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setIsHelpOpen(true); }} className="nav-link">Help</a>
        </div>
        <div className="nav-right">
          <div className="profile-section" onClick={() => setIsProfileOpen(true)}>
            <span className="profile-avatar">👤</span>
            <span className="profile-name">{user.username}</span>
          </div>
          <button onClick={onLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {activeModule === "Menu" && (
        <div className="home-content">
          <div className="dash-header">
            <div className="dash-title-group">
              <h2>Welcome, {user.username}!</h2>
              <p>Select a module below to get started.</p>
            </div>
          </div>
          <div className="dashboard-cards">
            {cards.map((card, index) => (
              <div className="card" key={index} onClick={() => setActiveModule(card.id)}>
                <div className="card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeModule === "Dashboard" && (
        <Dashboard user={user} onNavigate={setActiveModule} />
      )}

      {activeModule === "Village Administration" && (
        <VillageAdministration user={user} onNavigate={setActiveModule} />
      )}

      {activeModule === "Village Employees" && (
        <VillageEmployees user={user} onNavigate={setActiveModule} />
      )}

      {activeModule === "Government Administration" && (
        <GovernmentAdministration user={user} onNavigate={setActiveModule} />
      )}

      {activeModule === "People Directory" && (
        <PeopleDirectory user={user} onNavigate={setActiveModule} />
      )}

      {activeModule === "About Village" && (
        <AboutVillage onNavigate={setActiveModule} />
      )}

      {/* Placeholders for other modules */}
      {activeModule !== "Menu" && activeModule !== "Dashboard" && activeModule !== "Village Administration" && activeModule !== "Village Employees" && activeModule !== "Government Administration" && activeModule !== "People Directory" && activeModule !== "About Village" && (
        <div className="dashboard">
          <div className="dashboard-header">
            <h2>{activeModule}</h2>
            <p>This module is under construction.</p>
          </div>
        </div>
      )}

      {isAboutOpen && (
        <div className="modal-overlay" onClick={() => setIsAboutOpen(false)}>
          <div className="modal-content glass-panel" style={{ maxWidth: '500px', width: '90%', position: 'relative', textAlign: 'left', padding: '20px' }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsAboutOpen(false)} 
              style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s', padding: '5px' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
              title="Close"
            >
              <X size={22} color="#ff6b6b" />
            </button>

            <div style={{ marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--secondary)' }}>About Panchayat App</h2>
            </div>
            <div style={{ lineHeight: '1.4', color: '#aeb5d1', fontSize: '13px' }}>
              <p style={{ marginBottom: '12px' }}>
                <strong style={{ color: 'var(--text-main)' }}>Panchayat Management System (PMS)</strong> is a comprehensive digital administration platform designed to modernize rural governance. It provides a secure, unified portal for tracking citizens, managing community infrastructure, and organizing administrative workflows.
              </p>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '8px', fontSize: '14px' }}>Key Capabilities:</h4>
              <ul style={{ paddingLeft: '20px', marginBottom: '15px', listStyleType: 'disc' }}>
                <li style={{ marginBottom: '4px' }}><strong>People Directory:</strong> Full census tracking including demographics, education, and family linkage.</li>
                <li style={{ marginBottom: '4px' }}><strong>Dynamic Analytics:</strong> Real-time visualizations of population metrics using advanced data aggregation.</li>
                <li style={{ marginBottom: '4px' }}><strong>Village Infrastructure:</strong> Management of streets, households, and public assets.</li>
                <li style={{ marginBottom: '4px' }}><strong>Role-Based Access:</strong> Secure environments specifically tailored for Administrators, Officials, and Staff.</li>
              </ul>
              <div style={{ background: 'var(--bg-main)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(0, 210, 255, 0.1)', fontSize: '12px' }}>
                <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Version:</span> 2.1.0-alpha <br/>
                <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>System Status:</span> Fully Operational <br/>
                <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Data Compliance:</span> Encrypted & Verified
              </div>
            </div>
          </div>
        </div>
      )}

      {isServicesOpen && (
        <div className="modal-overlay" onClick={() => setIsServicesOpen(false)}>
          <div className="modal-content glass-panel" style={{ maxWidth: '600px', width: '90%', position: 'relative', textAlign: 'left', padding: '25px' }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsServicesOpen(false)} 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s', padding: '5px' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
              title="Close"
            >
              <X size={24} color="#ff6b6b" />
            </button>

            <div style={{ marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', color: 'var(--secondary)' }}>Services We Offer</h2>
            </div>
            <div style={{ lineHeight: '1.5', color: '#aeb5d1', fontSize: '14px' }}>
              <p style={{ marginBottom: '15px' }}>
                The <strong style={{ color: 'var(--text-main)' }}>Panchayat Management System</strong> provides a suite of digital governance tools designed to empower local administrators and improve the lives of citizens.
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div style={{ background: 'var(--bg-main)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: 'var(--secondary)', marginBottom: '8px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>👥</span> Citizen Services
                  </h4>
                  <ul style={{ paddingLeft: '15px', margin: 0, fontSize: '13px' }}>
                    <li>Family & People Directory</li>
                    <li>Digital Record Keeping</li>
                    <li>Scheme Applications</li>
                  </ul>
                </div>
                
                <div style={{ background: 'var(--bg-main)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <h4 style={{ color: 'var(--secondary)', marginBottom: '8px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>🏛️</span> Administration
                  </h4>
                  <ul style={{ paddingLeft: '15px', margin: 0, fontSize: '13px' }}>
                    <li>Government & Village Officials</li>
                    <li>Staff & Payroll Management</li>
                    <li>Village Infrastructure Management</li>
                  </ul>
                </div>
              </div>
              
              <div style={{ background: 'var(--bg-main)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(0, 210, 255, 0.1)', textAlign: 'center' }}>
                <p style={{ margin: 0, color: 'var(--text-main)', fontSize: '13px' }}>Need assistance accessing these services? Please contact your local Panchayat office.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {isHelpOpen && (
        <div className="modal-overlay" onClick={() => setIsHelpOpen(false)}>
          <div className="modal-content glass-panel" style={{ maxWidth: '600px', width: '90%', position: 'relative', textAlign: 'left', padding: '25px' }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsHelpOpen(false)} 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s', padding: '5px' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
              title="Close"
            >
              <X size={24} color="#ff6b6b" />
            </button>

            <div style={{ marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', color: 'var(--secondary)' }}>Help & Support</h2>
            </div>
            
            <div style={{ lineHeight: '1.5', color: '#aeb5d1', fontSize: '14px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '5px' }}>
              <h4 style={{ color: 'var(--text-main)', marginBottom: '10px', fontSize: '16px' }}>Frequently Asked Questions</h4>
              <div style={{ background: 'var(--bg-main)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px' }}>
                <div style={{ marginBottom: '12px' }}>
                  <strong style={{ color: 'var(--secondary)' }}>Q: How do I update my family details?</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>A: For security reasons, only administrators can modify records. Please contact the Village Admin to request updates.</p>
                </div>
                <div>
                  <strong style={{ color: 'var(--secondary)' }}>Q: I forgot my password, what do I do?</strong>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>A: Please contact the Village App Administrator using the details below to reset your credentials.</p>
                </div>
              </div>
              
              <h4 style={{ color: 'var(--text-main)', marginBottom: '10px', fontSize: '16px' }}>Contact App Administrator</h4>
              <p style={{ marginBottom: '15px', fontSize: '13px' }}>If you are experiencing technical difficulties or need system privileges updated, please reach out to the Village IT Administrator:</p>
              
              <div style={{ background: 'var(--bg-main)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(0, 210, 255, 0.1)', display: 'grid', gridTemplateColumns: '1fr', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>📞</span> 
                  <span style={{ color: 'var(--text-main)' }}>+91 98765 43210</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>✉️</span> 
                  <span style={{ color: 'var(--text-main)' }}>admin@panchayatapp.gov.in</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>📸</span> 
                  <span style={{ color: 'var(--text-main)' }}>@PanchayatApp_Admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isProfileOpen && (
        <ProfileSidebar 
          user={user} 
          onClose={() => setIsProfileOpen(false)} 
        />
      )}

      {isPrivacyOpen && (
        <div className="modal-overlay" onClick={() => setIsPrivacyOpen(false)}>
          <div className="modal-content glass-panel" style={{ maxWidth: '600px', width: '90%', position: 'relative', textAlign: 'left', padding: '25px' }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsPrivacyOpen(false)} 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s', padding: '5px' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
              title="Close"
            >
              <X size={24} color="#ff6b6b" />
            </button>

            <div style={{ marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', color: 'var(--secondary)' }}>Privacy Policy</h2>
            </div>
            
            <div style={{ lineHeight: '1.5', color: '#aeb5d1', fontSize: '14px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '5px' }}>
              <p style={{ marginBottom: '15px' }}>
                Your privacy is important to us. This Privacy Policy explains how the Panchayat Management System collects, uses, and safeguards your personal information.
              </p>
              
              <h4 style={{ color: 'var(--text-main)', marginBottom: '8px', fontSize: '15px' }}>Information We Collect</h4>
              <p style={{ marginBottom: '15px' }}>We collect personal details such as names, addresses, and family structures strictly for demographic tracking, scheme distribution, and village administration purposes.</p>

              <h4 style={{ color: 'var(--text-main)', marginBottom: '8px', fontSize: '15px' }}>Data Security</h4>
              <p style={{ marginBottom: '15px' }}>Your data is securely stored and only accessible by authorized Government and Village Officials. We employ standard security measures to prevent unauthorized access.</p>

              <h4 style={{ color: 'var(--text-main)', marginBottom: '8px', fontSize: '15px' }}>Data Sharing</h4>
              <p style={{ marginBottom: '15px' }}>We do not sell or share your personal information with third parties. Your data is used exclusively within the scope of governmental administration and public services.</p>
            </div>
          </div>
        </div>
      )}

      {isTermsOpen && (
        <div className="modal-overlay" onClick={() => setIsTermsOpen(false)}>
          <div className="modal-content glass-panel" style={{ maxWidth: '600px', width: '90%', position: 'relative', textAlign: 'left', padding: '25px' }} onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setIsTermsOpen(false)} 
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', cursor: 'pointer', opacity: 0.7, transition: 'opacity 0.2s', padding: '5px' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
              title="Close"
            >
              <X size={24} color="#ff6b6b" />
            </button>

            <div style={{ marginBottom: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '15px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', color: 'var(--secondary)' }}>Terms of Service</h2>
            </div>
            
            <div style={{ lineHeight: '1.5', color: '#aeb5d1', fontSize: '14px', maxHeight: '60vh', overflowY: 'auto', paddingRight: '5px' }}>
              <p style={{ marginBottom: '15px' }}>
                Welcome to the Panchayat Management System. By accessing or using this portal, you agree to be bound by these Terms of Service.
              </p>
              
              <h4 style={{ color: 'var(--text-main)', marginBottom: '8px', fontSize: '15px' }}>Authorized Use</h4>
              <p style={{ marginBottom: '15px' }}>This system is for authorized village residents and officials only. Any attempt to modify, disrupt, or access unauthorized data is strictly prohibited and may result in legal action.</p>

              <h4 style={{ color: 'var(--text-main)', marginBottom: '8px', fontSize: '15px' }}>Accuracy of Information</h4>
              <p style={{ marginBottom: '15px' }}>Users are responsible for ensuring that any information they submit (e.g., scheme applications, demographic updates) is accurate and truthful. Falsifying government records is a punishable offense.</p>

              <h4 style={{ color: 'var(--text-main)', marginBottom: '8px', fontSize: '15px' }}>Changes to Terms</h4>
              <p style={{ marginBottom: '15px' }}>The Village Administration reserves the right to modify these terms at any time. Continued use of the system constitutes acceptance of any updated terms.</p>
            </div>
          </div>
        </div>
      )}

      <Footer 
        showFull={activeModule === "Menu"} 
        onHomeClick={() => {
          setActiveModule("Menu");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onAboutClick={() => setActiveModule("About Village")}
        onServicesClick={() => setIsServicesOpen(true)}
        onTermsClick={() => setIsTermsOpen(true)}
        onPrivacyClick={() => setIsPrivacyOpen(true)}
        onSupportClick={() => setIsHelpOpen(true)}
      />
    </div>
  );
}
