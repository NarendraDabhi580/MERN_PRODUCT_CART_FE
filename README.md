# 🛒 MERN E-Commerce — Frontend

React frontend for the MERN E-Commerce project.  
Built with **React**, **TypeScript**, **Vite**, and **Axios**.

---

## 📦 Tech Stack

- React 19 + TypeScript
- Vite
- React Router DOM v7
- Axios

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/NarendraDabhi580/MERN_PRODUCT_CART_FE.git
cd MERN_PRODUCT_CART_FE
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

A `.env` file is already included in the repo:

```
VITE_API_URL=http://localhost:3200/api
```

> Make sure your **backend server is running on port 3200** before starting the frontend.  
> If your backend runs on a different URL, update `VITE_API_URL` in the `.env` file.

---

### 4. Start the development server

```bash
npm run dev
```

The app will open at: **http://localhost:5173**

---

## 🖥️ Features

- **Register / Login** — JWT-based authentication
- **Products Page** — View, search, and filter products by category
- **Add / Edit / Delete Products** — Full CRUD via modal
- **Cart** — Add items, update quantity, remove items
- **Checkout** — Order summary page
- **Protected Routes** — Auto-redirects to login if not authenticated

---

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── api/
│   │   └── api.ts            # Axios instance with auth interceptor
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── ToastProvider.tsx
│   ├── context/
│   │   └── AuthContext.tsx   # Global auth state (JWT token)
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Products.tsx
│   │   ├── Cart.tsx
│   │   └── Checkout.tsx
│   ├── App.tsx               # Routes + private route guard
│   └── main.tsx              # Entry point
├── .env
├── index.html
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## ⚠️ Make Sure Backend is Running First

Before starting the frontend, make sure you have the backend running:

```bash
# In the backend folder
npm run dev     # starts on http://localhost:3200
```

Then start the frontend:

```bash
# In the frontend folder
npm run dev     # opens on http://localhost:5173
```
