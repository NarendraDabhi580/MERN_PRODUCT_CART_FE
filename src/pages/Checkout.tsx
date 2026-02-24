import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { showToast } from "../components/ToastProvider";
import "./chekout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      await api.delete("/cart/clear");
      showToast("Order placed successfully! 🎉", "success");
      navigate("/");
    } catch {
      showToast("Failed to place order. Please try again.", "error");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container">
          <div className="checkout-card card">
            <div className="checkout-icon">🛒</div>
            <h1 className="checkout-title">Confirm Your Order</h1>
            <p className="checkout-sub">
              Review your cart before placing the order. Once confirmed, your
              order will be processed.
            </p>
            <div className="checkout-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => navigate("/cart")}
                disabled={placing}
              >
                ← Back to Cart
              </button>
              <button
                id="place-order-btn"
                className="btn btn-primary"
                onClick={handlePlaceOrder}
                disabled={placing}
              >
                {placing ? "Placing Order…" : "Place Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
