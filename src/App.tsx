import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ToastProvider from "./components/ToastProvider";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import { useAuth } from "./context/AuthContext";
import Cart from "./pages/Cart";

const PrivateRoutes = ({ children }: any) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Redirect logged-in users away from auth pages
const PublicRoutes = ({ children }: any) => {
  const { token } = useAuth();
  return token ? <Navigate to="/" replace /> : <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <ToastProvider />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoutes>
              <Login />
            </PublicRoutes>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoutes>
              <Register />
            </PublicRoutes>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoutes>
              <Products />
            </PrivateRoutes>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoutes>
              <Cart />
            </PrivateRoutes>
          }
        />
        <Route
          path="/checkout"
          element={
            <PrivateRoutes>
              <Checkout />
            </PrivateRoutes>
          }
        />
        <Route path="*" element={<Navigate to={"/"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
