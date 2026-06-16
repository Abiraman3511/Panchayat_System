import React from 'react';
import './AboutVillage.css';
import { BookOpen, GraduationCap, Users, Bus, Home, Store, Coffee, Map, Tractor, Wheat } from 'lucide-react';

const AboutVillage = ({ onNavigate }) => {
  // Static mock data for now. Can be hooked to backend later.
  const villageData = {
    infrastructure: [
      { title: "Schools", count: 4, icon: <BookOpen size={24} />, desc: "Primary & Secondary", color: "blue" },
      { title: "Colleges", count: 1, icon: <GraduationCap size={24} />, desc: "Arts & Science", color: "indigo" },
      { title: "Students", count: "1,250", icon: <Users size={24} />, desc: "Currently enrolled", color: "cyan" },
      { title: "Bus Stops", count: 6, icon: <Bus size={24} />, desc: "Connecting to major cities", color: "orange" },
    ],
    commercial: [
      { title: "Marriage Halls", count: 2, icon: <Home size={24} />, desc: "For public events", color: "pink" },
      { title: "Shops", count: 45, icon: <Store size={24} />, desc: "Retail & Grocery", color: "green" },
      { title: "Hotels", count: 5, icon: <Coffee size={24} />, desc: "Dining & Stay", color: "red" },
      { title: "Village Area", count: "5 sq km", icon: <Map size={24} />, desc: "Total geographical area", color: "purple" },
    ],
    agriculture: [
      { title: "Total Farmland", count: "850 Acres", icon: <Map size={24} />, desc: "Cultivable land" },
      { title: "Active Farmers", count: 320, icon: <Tractor size={24} />, desc: "Registered farmers" },
      { title: "Primary Crops", count: "Paddy, Sugarcane", icon: <Wheat size={24} />, desc: "Seasonal harvest" },
    ]
  };

  return (
    <div className="about-village-container">
      <div className="about-header">
        <button className="back-to-home-btn" onClick={() => onNavigate("Menu")}>
          ← Back to Home
        </button>
        <div className="about-header-content">
          <h1 className="about-title">About Our Village</h1>
          <p className="about-subtitle">Comprehensive overview of our village infrastructure, commercial, and agricultural assets.</p>
        </div>
      </div>

      <div className="about-sections">
        
        {/* Education & Infrastructure */}
        <div className="about-section">
          <div className="section-header">
            <h2>Education & Infrastructure</h2>
            <div className="section-line"></div>
          </div>
          <div className="info-grid">
            {villageData.infrastructure.map((item, idx) => (
              <div className={`info-card color-${item.color}`} key={idx}>
                <div className="info-icon">{item.icon}</div>
                <div className="info-content">
                  <h3 className="info-count">{item.count}</h3>
                  <h4 className="info-title">{item.title}</h4>
                  <p className="info-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commercial & Public Places */}
        <div className="about-section">
          <div className="section-header">
            <h2>Commercial & Public Places</h2>
            <div className="section-line"></div>
          </div>
          <div className="info-grid">
            {villageData.commercial.map((item, idx) => (
              <div className={`info-card color-${item.color}`} key={idx}>
                <div className="info-icon">{item.icon}</div>
                <div className="info-content">
                  <h3 className="info-count">{item.count}</h3>
                  <h4 className="info-title">{item.title}</h4>
                  <p className="info-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agriculture Banner */}
        <div className="about-section">
          <div className="section-header">
            <h2>Agriculture</h2>
            <div className="section-line"></div>
          </div>
          <div className="agriculture-banner">
            {villageData.agriculture.map((item, idx) => (
              <div className="agri-item" key={idx}>
                <div className="agri-icon">{item.icon}</div>
                <div className="agri-details">
                  <h3>{item.count}</h3>
                  <p>{item.title}</p>
                  <span>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutVillage;
