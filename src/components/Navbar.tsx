import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./navbar.css";

const Navbar = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!token) return null;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to={"/"} className="navbar-brand">
          🛍 ShopMe
        </Link>
        <div className="navbar-links">
          <Link to={"/"} className={location.pathname === "/" ? "active" : ""}>
            Products
          </Link>
          <Link
            to={"/cart"}
            className={location.pathname === "/cart" ? "active" : ""}
          >
            Cart
          </Link>
          <button className="navbar-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
