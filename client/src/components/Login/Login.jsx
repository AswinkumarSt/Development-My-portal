import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../footer/footer.jsx";
import "./Login.css";
import EyeOffIcon from "/Myportal/client/src/assets/eye-off.svg";
import EyeIcon from "/Myportal/client/src/assets/eye.svg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // API base URL
  const API_BASE_URL = "https://development-my-portal.onrender.com/api";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Save token to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      {/* Background Image - Simplified */}
      <div className="background-image-container">
        <div className="background-image"></div>
      </div>

      {/* Login Form */}
      <div className="login-main">
        <div className="login-container">
          <div className="login-header">
            <h1>MyPortal</h1>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Username</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group password-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                  autoComplete="current-password"
                />
                <span 
                  className="password-toggle" 
                  onClick={togglePasswordVisibility}
                >
                  <img 
                    src={showPassword ? EyeOffIcon : EyeIcon} 
                    alt={showPassword ? "Hide password" : "Show password"}
                  />
                </span>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;