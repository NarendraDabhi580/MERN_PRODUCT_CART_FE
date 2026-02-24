import { useEffect, useState } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import { showToast } from "../components/ToastProvider";
import "./Products.css";

interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Furniture",
  "Books",
  "Sports",
  "Beauty",
];
const BLANK = {
  name: "",
  price: "",
  imageUrl: "",
  category: "Electronics",
  stock: "",
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // CRUD modal
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<typeof BLANK>({ ...BLANK });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete confirm
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Add to cart loading
  const [addingId, setAddingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/product");
      const data = Array.isArray(res.data)
        ? res.data
        : (res.data.products ?? []);
      setProducts(data);
    } catch {
      setError("Failed to load products. Make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditId(null);
    setForm({ ...BLANK });
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (p: Product) => {
    setEditId(p._id);
    setForm({
      name: p.name,
      price: String(p.price),
      imageUrl: p.imageUrl,
      category: p.category,
      stock: String(p.stock),
    });
    setFormError("");
    setShowModal(true);
  };

  const saveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.price ||
      !form.imageUrl ||
      !form.category ||
      !form.stock
    ) {
      setFormError("All fields are required.");
      return;
    }
    setSaving(true);
    setFormError("");
    const payload = {
      name: form.name.trim(),
      price: parseFloat(form.price),
      imageUrl: form.imageUrl.trim(),
      category: form.category,
      stock: parseInt(form.stock),
    };
    try {
      if (editId) {
        await api.put(`/product/${editId}`, payload);
        showToast("Product updated successfully", "success");
      } else {
        await api.post("/product", payload);
        showToast("Product added successfully", "success");
      }
      setShowModal(false);
      load();
    } catch {
      setFormError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/product/${deleteId}`);
      showToast("Product deleted", "success");
      setDeleteId(null);
      load();
    } catch {
      showToast("Failed to delete product", "error");
    } finally {
      setDeleting(false);
    }
  };

  const addToCart = async (id: string) => {
    setAddingId(id);
    try {
      await api.post("/cart/add", { productId: id, quantity: 1 });
      showToast("Added to cart!", "success");
    } catch {
      showToast("Failed to add to cart", "error");
    } finally {
      setAddingId(null);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (category ? p.category === category : true),
  );

  return (
    <>
      <Navbar />
      <div className="page-wrapper">
        <div className="container">
          {/* Header row */}
          <div className="products-header">
            <h2 className="products-heading">Products</h2>
            <button
              id="add-product-btn"
              className="btn btn-primary btn-sm"
              onClick={openCreate}
            >
              + Add Product
            </button>
          </div>

          {/* Filters */}
          <div className="filters-row">
            <input
              id="product-search"
              className="form-input search-input"
              placeholder="Search by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              id="category-filter"
              className="form-select category-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          {loading && <p className="loading">Loading products…</p>}
          {error && (
            <div className="auth-error" style={{ maxWidth: 480 }}>
              {error}
            </div>
          )}

          {/* Grid */}
          {!loading && !error && filtered.length === 0 && (
            <div className="empty-state">
              <p>No products found.</p>
              <button className="btn btn-primary btn-sm" onClick={openCreate}>
                Add your first product
              </button>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div className="products-grid">
              {filtered.map((p) => (
                <div className="product-card card" key={p._id}>
                  <div className="product-img-wrap">
                    <img
                      className="product-img"
                      src={p.imageUrl}
                      alt={p.name}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/300x200/e5e7eb/9ca3af?text=No+Image";
                      }}
                    />
                  </div>
                  <div className="product-body">
                    <div className="product-category">{p.category}</div>
                    <h3 className="product-name">{p.name}</h3>
                    <div className="product-price">${p.price.toFixed(2)}</div>
                    <div
                      className={`product-stock ${p.stock > 0 ? "in-stock" : "out-stock"}`}
                    >
                      {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                    </div>

                    <div className="product-actions">
                      <button
                        id={`add-cart-${p._id}`}
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                        onClick={() => addToCart(p._id)}
                        disabled={addingId === p._id || p.stock === 0}
                      >
                        {addingId === p._id ? "Adding…" : "Add to Cart"}
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEdit(p)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => setDeleteId(p._id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="modal">
            <div className="modal-header">
              <span className="modal-title">
                {editId ? "Edit Product" : "Add Product"}
              </span>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            {formError && <div className="auth-error">{formError}</div>}
            <form onSubmit={saveProduct}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input
                    className="form-input"
                    placeholder="Product name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  className="form-input"
                  placeholder="https://…"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Stock</label>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={saving}
                >
                  {saving ? "Saving…" : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setDeleteId(null)}
        >
          <div className="modal" style={{ maxWidth: 360 }}>
            <div className="modal-header">
              <span className="modal-title">Delete Product?</span>
              <button className="modal-close" onClick={() => setDeleteId(null)}>
                ✕
              </button>
            </div>
            <p style={{ color: "#6b7280", marginBottom: 20, fontSize: 14 }}>
              This product will be permanently deleted and cannot be recovered.
            </p>
            <div
              className="modal-footer"
              style={{ paddingTop: 0, borderTop: "none" }}
            >
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={deleteProduct}
                disabled={deleting}
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
