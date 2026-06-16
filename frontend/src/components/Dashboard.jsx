import { useState, useEffect } from 'react';
import "./Dashboard.css";

// Reusable component for the sleek dark mode list (like "Top Products" in the image)
const SleekList = ({ title, data, colors }) => (
  <div className="dark-panel">
    <h3>{title}</h3>
    <div className="sleek-list">
      {data.map((item, idx) => {
         const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;
         const percentage = Math.round((item.value / total) * 100);
         const barColor = colors[idx % colors.length];
         return (
          <div className="sleek-list-item" key={idx}>
            <div className="sleek-item-icon" style={{background: barColor}}></div>
            <div className="sleek-item-content">
              <div className="sleek-item-header">
                <span className="sleek-name">{item.name}</span>
                <span className="sleek-val">{item.value}</span>
              </div>
              <div className="sleek-bar-bg">
                <div className="sleek-bar-fill" style={{ width: `${percentage}%`, background: barColor }}></div>
              </div>
            </div>
          </div>
         );
      })}
    </div>
  </div>
);

// Reusable component for the Donut Chart (like "Customer Satisfaction" in the image)
const DonutChartPanel = ({ title, data, colors }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0) || 1;
  let currentAngle = 0;
  
  // Calculate conic gradient segments
  const gradientStops = data.map((item, idx) => {
    const percentage = (item.value / total) * 100;
    const start = currentAngle;
    const end = currentAngle + percentage;
    currentAngle = end;
    return `${colors[idx % colors.length]} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div className="dark-panel donut-panel">
      <h3>{title}</h3>
      <div className="donut-container">
        <div className="donut-chart" style={{ background: `conic-gradient(${gradientStops})` }}>
          <div className="donut-hole">
            <span className="donut-center-val">{data[0]?.value || 0}</span>
            <span className="donut-center-label">{data[0]?.name || ''}</span>
          </div>
        </div>
        <div className="donut-legend">
          {data.map((item, idx) => (
            <div className="legend-item" key={idx}>
              <span className="legend-dot" style={{ background: colors[idx % colors.length] }}></span>
              <div className="legend-text">
                <span className="legend-label">{item.name}</span>
                <span className="legend-val">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Dashboard({ user, onNavigate }) {
  const [stats, setStats] = useState({
    summary: { totalPopulation: 0, totalFamilies: 0, totalStreets: 0, administrators: 0, employees: 0 },
    streetData: [],
    genderStats: [],
    maritalStats: [],
    casteStats: [],
    ageStats: [],
    eduStats: []
  });

  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/dashboard/stats');
        if (res.ok) {
          setStats(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();

    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', dateOptions));
  }, []);

  const topCards = [
    { label: "Total Population", value: stats.summary.totalPopulation, subtitle: "Village Residents", gradient: "blue-wave" },
    { label: "Total Families", value: stats.summary.totalFamilies, subtitle: "Households Registered", gradient: "orange-wave" },
    { label: "Total Streets", value: stats.summary.totalStreets, subtitle: "Active Locations", gradient: "purple-wave" },
  ];

  const formattedStreetData = stats.streetData.map(s => ({ name: s.name, value: s.population }));

  return (
    <div className="dashboard-dark">
      <div className="dash-header" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <button className="back-to-home-btn" onClick={() => onNavigate("Menu")}>
          ← Back to Home
        </button>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div className="dash-title-group">
            <h2>Welcome back, {user.username}!</h2>
            <p>{currentDate}</p>
          </div>
        <div className="dash-user-controls">
          <div className="notification-icon">🔔</div>
          <div className="user-avatar"></div>
        </div>
        </div>
      </div>

      {/* Top Wave Cards */}
      <div className="top-wave-cards">
        {topCards.map((card, idx) => (
          <div className={`wave-card ${card.gradient}`} key={idx}>
            <div className="wave-card-content">
              <h4>{card.label}</h4>
              <h2>{card.value}</h2>
              <div className="wave-subtitle">
                <span className="wave-trend">📈 +Active</span>
                <span className="wave-time">{card.subtitle}</span>
              </div>
            </div>
            <div className="wave-svg-bg"></div>
          </div>
        ))}
      </div>

      {/* Main Grid Content */}
      <div className="dash-main-grid">
        {/* Left Column (Lists) */}
        <div className="dash-col-left">
          <SleekList title="Street-wise Population" data={formattedStreetData} colors={['#4f46e5', '#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe']} />
          <SleekList title="Age Demographics" data={stats.ageStats} colors={['#1e293b', '#334155', '#475569']} />
          <SleekList title="Education Levels" data={stats.eduStats} colors={['#0ea5e9', '#38bdf8', '#7dd3fc']} />
        </div>

        {/* Right Column (Donuts and Smaller widgets) */}
        <div className="dash-col-right">
          <DonutChartPanel title="Gender Distribution" data={stats.genderStats} colors={['#4f46e5', '#1e293b', '#94a3b8']} />
          <DonutChartPanel 
            title="Marital Status" 
            data={[...stats.maritalStats].sort((a, b) => a.name === "Divorced" ? 1 : b.name === "Divorced" ? -1 : 0)} 
            colors={['#6366f1', '#334155', '#cbd5e1']} 
          />
          <SleekList title="Caste Demographics" data={stats.casteStats} colors={['#0ea5e9', '#4f46e5', '#1e293b']} />
        </div>
      </div>
    </div>
  );
}
