import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { showToast } from "../components/ToastProvider";
import "./Cart.css";

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    imageUrl: string;
    category: string;
  } | null;
  quantity: number;
}

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    api
      .get("/cart")
      .then((res) => {
        if (active) {
          const validItems = (res.data.cart.items ?? []).filter(
            (item: CartItem) => item.product !== null,
          );
          setItems(validItems);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setError("Failed to load cart.");
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, []);

  const updateQty = async (id: string, qty: number) => {
    if (qty < 1 || updatingId === id) return;
    setUpdatingId(id);
    try {
      await api.put(`/cart/update/${id}`, { quantity: qty });
      setItems((prev) =>
        prev.map((i: any) =>
          i.product._id === id ? { ...i, quantity: qty } : i,
        ),
      );
    } catch {
      showToast("Failed to update quantity", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const remove = async (id: string) => {
    if (removingId === id) return;
    setRemovingId(id);
    try {
      await api.delete(`/cart/remove/${id}`);
      setItems((prev) => prev.filter((i: any) => i.product._id !== id));
      showToast("Item removed from cart", "info");
    } catch {
      showToast("Failed to remove item", "error");
    } finally {
      setRemovingId(null);
    }
  };

  const subtotal = items.reduce(
    (s, i) => s + (i.product ? i.product.price * i.quantity : 0),
    0,
  );
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container">
          <div className="cart-header">
            <h2 className="cart-heading">Shopping Cart</h2>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate("/")}
            >
              ← Back to Products
            </button>
          </div>

          {loading && <p className="loading">Loading cart…</p>}
          {error && (
            <div className="auth-error" style={{ maxWidth: 480 }}>
              {error}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="empty-state">
              <p>Your cart is empty.</p>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => navigate("/")}
              >
                Browse Products
              </button>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="cart-layout">
              {/* Items */}
              <div className="cart-items">
                {items.map((item: any) => (
                  <div className="cart-item card" key={item.product._id}>
                    <img
                      className="cart-item-img"
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/80x80/e5e7eb/9ca3af?text=?";
                      }}
                    />
                    <div className="cart-item-info">
                      <div className="cart-item-name">{item.product.name}</div>
                      <div className="cart-item-cat">
                        {item.product.category}
                      </div>
                      <div className="cart-item-price">
                        ${item.product.price.toFixed(2)}
                      </div>
                    </div>
                    <div className="cart-item-right">
                      <div className="qty-row">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQty(item.product._id, item.quantity - 1)
                          }
                          disabled={
                            item.quantity <= 1 ||
                            updatingId === item.product._id ||
                            removingId === item.product._id
                          }
                        >
                          −
                        </button>
                        <span className="qty-val">
                          {updatingId === item.product._id
                            ? "…"
                            : item.quantity}
                        </span>
                        <button
                          className="qty-btn"
                          onClick={() =>
                            updateQty(item.product._id, item.quantity + 1)
                          }
                          disabled={
                            updatingId === item.product._id ||
                            removingId === item.product._id
                          }
                        >
                          +
                        </button>
                      </div>
                      <div className="cart-line-total">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </div>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => remove(item.product._id)}
                        disabled={
                          removingId === item.product._id ||
                          updatingId === item.product._id
                        }
                      >
                        {removingId === item.product._id
                          ? "Removing…"
                          : "Remove"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="cart-summary card">
                <h3 className="summary-title">Order Summary</h3>
                <div className="summary-row">
                  <span>Items ({itemCount})</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span style={{ color: "#059669" }}>Free</span>
                </div>
                <hr className="summary-hr" />
                <div className="summary-row summary-total-row">
                  <span>Total</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <button
                  id="checkout-btn"
                  className="btn btn-primary btn-full"
                  style={{ marginTop: 16 }}
                  onClick={() => navigate("/checkout")}
                  disabled={loading || !!updatingId || !!removingId}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
