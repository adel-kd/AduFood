# AduFood 

A full-stack MERN food delivery platform built for the Ethiopian market, featuring secure authentication, food ordering, favorites, cart management, address handling, admin controls, and Chapa payment integration.

##  Live Demo

Frontend: *(Add your deployed frontend URL here)*
Backend API: *(Add your deployed backend URL here)*

---

## 📌 Features

### 👤 User Features

* User registration and login (JWT authentication)
* Browse food listings
* Search and filter foods
* Add/remove favorites
* Add/update cart items
* Save multiple delivery addresses
* Checkout with secure payment via Chapa
* View order history
* Promo code support
* Responsive mobile-friendly UI

### 🛠 Admin Features

* Add new food items
* Edit food details
* Delete foods
* Manage orders
* View analytics dashboard
* Track revenue and top-selling foods

### 💳 Payment System

* Chapa payment gateway integration
* Transaction verification


---

## 🏗 Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

### Payment

* Chapa API

---

## 📂 Project Structure

```bash
AduFood/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
```

---

## ⚙️ Installation

### 1. Clone repository

```bash
git clone https://github.com/adel-kd/AduFood.git
cd AduFood
```

---

### 2. Install dependencies

Frontend:

```bash
cd client
npm install
```

Backend:

```bash
cd server
npm install
```

---

## 🔐 Environment Variables

Create `.env` in backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret
CHAPA_SECRET_KEY=your_chapa_secret
```

Create `.env` in frontend:

```env
VITE_API_URL=http://localhost:5000
```

---

## ▶ Running the Project

Backend:

```bash
cd server
npm run dev
```

Frontend:

```bash
cd client
npm run dev
```

---

## 🔄 Payment Flow

1. User selects delivery address
2. User proceeds to checkout
3. Backend calculates total securely
4. Payment initializes via Chapa
5. User completes payment
6. Chapa redirects back with transaction reference
7. Payment gets verified
8. Order is created
9. Cart is cleared

---

## 📸 Screenshots

Add screenshots here:

* Home page
* Food listing
* Cart page
* Checkout page
* Orders page
* Admin dashboard

---

## 🔒 Security

* JWT protected routes
* Admin-only middleware
* Server-side payment verification
* Secure transaction tracking

---

## 🌍 Target Market

Built specifically for Ethiopian food delivery businesses and local restaurant ecosystems.

---

## 📈 Future Improvements

* Real-time order tracking
* Driver management
* Push notifications
* Ratings and reviews
* AI food recommendations
* Multi-vendor support

---

## 👨‍💻 Author

**Adel Kedir**

GitHub: https://github.com/adel-kd
LinkedIn: *(Add your LinkedIn)*

---

