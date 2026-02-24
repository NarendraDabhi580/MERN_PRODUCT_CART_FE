import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { showToast } from "../components/ToastProvider";
import "./auth.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setError("");

    const { email, password } = formData;

    if (!email || !password) {
      setError("Please fill details in all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token);
      showToast("Logged in successfully", "success");
      navigate("/");
    } catch {
      setError("Invalid email or password.");
      showToast("Login failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="auth-page">
      <div className="auth-box card">
        <h1 className="auth-title">Sign In</h1>
        <p className="auth-sub">Welcome back to ShopMe</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grp">
            <label className="form-label">Email</label>
            <input
              type="text"
              className="form-input"
              id="login-email"
              name="email"
              placeholder="name@gmail.com"
              value={formData?.email}
              onChange={handleChange}
              autoFocus
            />
          </div>
          <div className="form-grp">
            <label className="form-label">password</label>
            <input
              type="password"
              className="form-input"
              id="login-password"
              name="password"
              placeholder="******"
              value={formData?.password}
              onChange={handleChange}
            />
          </div>
          <button
            id="login-submit"
            type="submit"
            className="btn btn-primary btn full"
            style={{ marginTop: 4 }}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="auth-footer-text">
          Don't have an account? <Link to={"/register"}>Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
