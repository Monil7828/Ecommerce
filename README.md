
# 🛒 Ecommerce Platform

A full-stack modern e-commerce web application built with **Next.js 13**, **MongoDB**, **Tailwind CSS**, and **Context API**. This app allows users to browse products, manage their cart, place orders, and view their purchase history. Admins can manage products and orders via a protected dashboard.

## ✨ Features

### 🧑‍💻 User
- Register, login, and logout
- Browse and search products
- Add/remove items from the cart
- Checkout and place orders
- Track order status (Processing/Delivered)
- View past orders and order details

### 🛠️ Admin
- Admin dashboard with product management
- Add/edit/delete products
- View all orders and their statuses

### 💡 Tech Stack

| Tech       | Usage                          |
|------------|--------------------------------|
| Next.js 13 | App routing, API routes        |
| MongoDB    | NoSQL Database (via Mongoose)  |
| Tailwind CSS | UI styling                   |
| Context API | Global state (auth, cart, etc.) |
| React Toastify | Notifications              |
| React Spinners | Loaders                    |

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Monil7828/Ecommerce.git
cd Ecommerce
````

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add the following:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
/app
  /api         → API route handlers
  /(pages)     → App routes (user/admin)
  /components  → Reusable UI components
  /context     → Global context (auth, cart)
  /services    → API interaction functions
  /utils       → Utility helpers
/public        → Static assets
```

## 📦 Features Under Development

* Payment integration (Stripe)
* Product filters and categories
* SEO optimization
* Enhanced admin analytics
