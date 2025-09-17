import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Cart from './pages/Cart.jsx';
import Favorites from './pages/Favorites.jsx';
import Orders from './pages/Order.jsx';
import FoodDetail from './pages/FoodDetail.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ManageFoods from './pages/ManageFoods.jsx';
import Analytics from './pages/Analytics.jsx';
import ProtectedRoute from './components/protectedroute.jsx';
import { AuthProvider } from './contexts/authcontext.jsx';
import { CartProvider } from './contexts/cartcontext.jsx';
import OrdersManagement from './pages/OrdersManagment.jsx';
import AddOrEditFood from './pages/AddOrEditFood.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
// import PaymentResult from './pages/PaymentResult.jsx';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/food/:id" element={<FoodDetail />} />

            {/* Protected Routes */}
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute adminRequired><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/foods" element={<ProtectedRoute adminRequired><ManageFoods /></ProtectedRoute>} />
            <Route path="/admin/analytics" element={<ProtectedRoute adminRequired><Analytics /></ProtectedRoute>} />
            <Route path="/admin/orders" element={<ProtectedRoute adminRequired><OrdersManagement /></ProtectedRoute>} />
            <Route path="/admin/food/:id?" element={<ProtectedRoute adminRequired><AddOrEditFood /></ProtectedRoute>} />

            {/* Checkout Success */}
            {/* <Route path="/checkout" element={< PaymentResult />} /> */}
          </Routes>
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
