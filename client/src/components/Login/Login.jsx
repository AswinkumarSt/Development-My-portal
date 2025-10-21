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
      console.log("🔐 [DEBUG] Login attempt started");
      console.log("📧 [DEBUG] Email:", formData.email);
      console.log("🔑 [DEBUG] Password length:", formData.password.length);
      console.log("📡 [DEBUG] Sending request to: http://localhost:5000/api/auth/login");

      const requestBody = JSON.stringify(formData);
      console.log("📦 [DEBUG] Request body:", requestBody);

      const startTime = Date.now();
      
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      const endTime = Date.now();
      console.log("⏱️ [DEBUG] Request took:", endTime - startTime, "ms");
      console.log("📡 [DEBUG] Response status:", response.status);
      console.log("📡 [DEBUG] Response ok:", response.ok);
      console.log("📡 [DEBUG] Response headers:", Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log("📡 [DEBUG] Response data:", data);

      if (response.ok) {
        console.log("✅ [DEBUG] Login successful!");
        console.log("✅ [DEBUG] Token received:", data.token ? "Yes" : "No");
        console.log("✅ [DEBUG] User data:", data.user);

        // Save token to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        console.log("✅ [DEBUG] Data saved to localStorage");
        console.log("🔄 [DEBUG] Redirecting to dashboard...");

        // Redirect to dashboard
        navigate("/dashboard");
      } else {
        console.log("❌ [DEBUG] Login failed with error:", data.error);
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.error("💥 [DEBUG] Network error details:", error);
      console.error("💥 [DEBUG] Error name:", error.name);
      console.error("💥 [DEBUG] Error message:", error.message);
      console.error("💥 [DEBUG] Error stack:", error.stack);
      
      setError("Network error. Please try again. Check console for details.");
    } finally {
      console.log("🏁 [DEBUG] Login attempt finished");
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
      <Footer></Footer>
    </div>
  );
};

export default Login;