import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { showToast } from "../components/ToastProvider";
import "./auth.css";

const Register = () => {
  const [formData, setFormData] = useState<any>({
    fullname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setError("");

    const { fullname, email, password } = formData;

    if (!fullname || !email || !password) {
      setError("Please fill details in all fields");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", { name: fullname, email, password });
      showToast("Account created! Please sign in.", "success");
      navigate("/login");
    } catch {
      setError("Registration failed. Email may already exist");
      showToast("Registration failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleFormData = (event: any) => {
    const { name, value } = event.target;
    setFormData((pre: any) => ({ ...pre, [name]: value }));
  };
  return (
    <div className="auth-page">
      <div className="auth-box card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Join ShopMe Today</p>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <></>
          <div className="form-grp">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              id="register-name"
              className="form-input"
              placeholder="Narendra Dabhi"
              name="fullname"
              value={formData?.fullname}
              onChange={handleFormData}
              autoFocus
            />
          </div>
          <div className="form-grp">
            <label className="form-label">Email</label>
            <input
              type="text"
              id="register-email"
              className="form-input"
              placeholder="name@gmail.com"
              name="email"
              value={formData?.email}
              onChange={handleFormData}
            />
          </div>
          <div className="form-grp">
            <label className="form-label">Password</label>
            <input
              type="password"
              id="register-password"
              className="form-input"
              placeholder="Min 6. characters"
              name="password"
              value={formData?.password}
              onChange={handleFormData}
            />
          </div>
          <button
            className="btn btn-primary btn-full"
            id="register-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="auth-footer-text">
          Already have an account? <Link to={"/login"}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
