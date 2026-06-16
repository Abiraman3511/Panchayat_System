// src/pages/Login.jsx
import { useState } from "react";
import "./Login.css";
import loginImage from "../assets/login-image.png";

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const [dialog, setDialog] = useState({ isOpen: false, message: "", type: "info" });

  const showDialog = (message, type = "info") => {
    setDialog({ isOpen: true, message, type });
  };

  const handleSendOtp = async () => {
    if (!email || !phone || !username || !password || !confirmPassword) {
      showDialog("Please fill in all fields before requesting OTP.", "error");
      return;
    }
    if (password !== confirmPassword) {
      showDialog("Passwords do not match!", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://panchayat-system.onrender.com/api/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) {
        showDialog(data.message || data.detail || "Failed to send OTP.", "error");
      } else {
        showDialog(`OTP sent successfully! For testing, your code is: ${data.otp}`, "success");
        setOtpSent(true);
      }
    } catch (error) {
      console.error(error);
      showDialog("Unable to reach backend.", "error");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegistering && !otpSent) {
      await handleSendOtp();
      return;
    }

    setLoading(true);
    try {
      const endpoint = isRegistering ? "/api/auth/verify-otp" : "/api/auth/login";
      const payload = isRegistering 
        ? { username, password, confirmPassword, email, phoneNumber: phone, otpCode: otp } 
        : { username, password };

      const response = await fetch(`https://panchayat-system.onrender.com${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      const data = await response.json();
      if (!response.ok) {
        showDialog(data.message || data.detail || "Request Failed.", "error");
        setLoading(false);
        return;
      }

      if (isRegistering) {
        showDialog("Registration successful! Now login.", "success");
        setIsRegistering(false);
        setOtpSent(false);
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        setPhone("");
        setOtp("");
      } else {
        // Universal login endpoint returns isAdmin flag automatically
        onLoginSuccess({ 
          username, 
          token: data.token, 
          isAdmin: data.isAdmin,
          email: data.user?.email || "",
          phoneNumber: data.user?.phoneNumber || ""
        });
      }
    } catch (error) {
      console.error(error);
      showDialog("Unable to reach backend.", "error");
    }
    setLoading(false);
  };

  return (
    <div className="login-wrapper">
      <div className="login-split-container">
        {/* Left Side: Image */}
        <div className="login-image-section">
          <img src={loginImage} alt="Village KKM System" />
        </div>

        {/* Right Side: Form */}
        <div className="login-form-section">
          <div className="login-box single-login-box">
            <h2>{isRegistering ? "Citizen Registration" : "System Login"}</h2>
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={isRegistering ? "Choose a username" : "Enter username"}
                  autoComplete="off"
                  required
                />
              </div>

              {isRegistering && (
                <>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="For OTP verification"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit number"
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isRegistering ? "Create password" : "Enter password"}
                  autoComplete="new-password"
                  required
                />
              </div>

              {isRegistering && (
                <>
                  <div className="form-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      required
                    />
                  </div>
                  
                  {otpSent && (
                    <div className="form-group otp-group">
                      <label>Enter OTP from Email</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="6-digit code"
                        required
                      />
                    </div>
                  )}
                </>
              )}

              <button type="submit" disabled={loading}>
                {loading 
                  ? "Processing..." 
                  : isRegistering 
                    ? (otpSent ? "Verify & Register" : "Send OTP") 
                    : "Login"}
              </button>
            </form>

            <p className="toggle-auth" style={{ marginTop: "20px", fontSize: "0.95rem", color: "var(--text-muted)" }}>
              {isRegistering ? "Already have an account? " : "Don't have an account? "}
              <span 
                style={{ color: "var(--primary)", cursor: "pointer", textDecoration: "underline", fontWeight: "bold" }}
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setOtpSent(false);
                }}
              >
                {isRegistering ? "Login here" : "Register here"}
              </span>
            </p>
          </div>
        </div>
      </div>

      {dialog.isOpen && (
        <div className="modal-overlay" style={{ zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setDialog({ ...dialog, isOpen: false })}>
          <div className="modal-content single-login-box" style={{ maxWidth: "350px", textAlign: "center", padding: "30px", background: "var(--bg-card)", border: `1px solid ${dialog.type === 'error' ? 'var(--danger)' : 'var(--primary)'}` }} onClick={e => e.stopPropagation()}>
            <div style={{ marginBottom: "20px" }}>
              {dialog.type === "error" ? (
                <div style={{ background: "rgba(239, 68, 68, 0.1)", width: "60px", height: "60px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto" }}>
                  <span style={{ fontSize: "30px", color: "var(--danger)" }}>!</span>
                </div>
              ) : (
                <div style={{ background: "rgba(79, 70, 229, 0.1)", width: "60px", height: "60px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", margin: "0 auto" }}>
                  <span style={{ fontSize: "30px", color: "var(--primary)" }}>✓</span>
                </div>
              )}
            </div>
            <h3 style={{ color: "var(--secondary)", marginBottom: "25px", fontSize: "1.1rem", fontWeight: "600", lineHeight: "1.4" }}>
              {dialog.message}
            </h3>
            <button 
              onClick={() => setDialog({ ...dialog, isOpen: false })}
              style={{
                background: dialog.type === 'error' ? 'var(--danger)' : 'var(--primary)',
                color: 'white',
                border: 'none',
                padding: '10px 30px',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'opacity 0.2s',
                width: '100%'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = 0.8}
              onMouseLeave={e => e.currentTarget.style.opacity = 1}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
