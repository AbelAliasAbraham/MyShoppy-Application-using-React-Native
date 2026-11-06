
# MyShoppy-Application-using-React-Native


A modern React Native shopping application built with **Expo** and **TypeScript**. MyShoppy provides a clean and intuitive e-commerce experience where users can browse household products, search and filter items, view product details, manage a shopping cart, and complete a checkout process.

---

## 📖 Overview

MyShoppy is a React Native shopping application developed using Expo. The application demonstrates modern mobile development concepts including navigation, reusable components, state management using Context API, product filtering, and a complete shopping workflow.

This project serves as a capstone-style application for learning and demonstrating React Native development.

---

## ✨ Features

- 🏠 Modern Home screen with featured products
- 🔍 Product search functionality
- 📂 Category-based product browsing
- 🎯 Product filtering and sorting
- 📦 Detailed product information
- 🛒 Shopping cart management
- ➕ Increase/Decrease product quantity
- ❌ Remove items from cart
- 💳 Checkout with delivery details
- 📍 Address validation
- 📱 Payment method selection
- ✅ Order confirmation with transaction ID
- 🌐 Cross-platform support (Android, iOS, Web)
- ⚡ Global cart management using Context API

---

## 📱 App Screens

- Home
- Categories
- Category Products
- Product Details
- Shopping Cart
- Checkout
- Order Confirmation

---

## 📂 Project Structure

```text
MyShoppy/
├── App.tsx
├── app.json
├── index.ts
├── package.json
├── tsconfig.json
├── assets/
│
├── src/
│   ├── context/
│   │   └── CartContext.tsx
│   │
│   ├── data/
│   │   └── db.json
│   │
│   ├── screens/
│       ├── HomeScreen.tsx
│       ├── CategoriesScreen.tsx
│       ├── CategoryProductsScreen.tsx
│       ├── ProductDetailsScreen.tsx
│       └── CartScreen.tsx
│    
│
└── README.md
```

---

## 🛠️ Tech Stack

- React Native
- Expo
- TypeScript
- React Navigation
- Context API
- Expo Vector Icons
- Local JSON Database
- Axios

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd MyShoppy
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Install Expo Packages

```bash
npx expo install
```

---

### 4. Install Required Packages

```bash
npx expo install react-native-screens react-native-safe-area-context @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs @expo/vector-icons react-dom react-native-web axios
```

---

### 5. Start the Expo Server

```bash
npx expo start
```

---

### 6. Clear Expo Cache (Optional)

```bash
npx expo start -c
```

---

### 7. Run the Application

Android Emulator

```text
Press a
```

Web

```text
Press w
```

Expo Go

```text
Scan the QR Code using Expo Go.
```

Alternative Commands

```bash
npm run android

npm run ios

npm run web
```

---

## 🧭 Navigation

### Bottom Tabs

- Home
- Categories
- Cart

### Stack Screens

- Home
- Category Products
- Product Details
- Checkout

---

## 🔍 Search & Filter

Users can

- Search products
- Search categories
- Filter products under ₹1000
- Filter products above ₹1000
- Filter in-stock products
- Sort Price (Low → High)
- Sort Price (High → Low)
- Sort Top Rated products

---

## 🛒 Shopping Cart Features

- Add products
- Remove products
- Increase quantity
- Decrease quantity
- Prevent adding beyond stock limit
- Automatic cart total calculation
- Clear cart after successful order

---

## 💳 Checkout Features

- Delivery address form
- Address type selection
- Mobile number validation
- Payment method selection
- Order confirmation
- Random transaction ID generation

---

## 📊 State Management

The application uses **React Context API**.

### CartContext provides

- addToCart()
- updateQuantity()
- removeFromCart()
- clearCart()
- cartTotal

The cart is globally accessible across all screens.

---

## 📁 Data Source

The application uses a local **db.json** file.

The database contains:

- Categories
- Products
- Product Images
- Ratings
- Prices
- Stock Availability
- Descriptions

---

## 👤 User Flow

```text
Home
   │
   ▼
Browse Featured Products
   │
   ▼
Categories
   │
   ▼
Category Products
   │
   ▼
Product Details
   │
   ▼
Add to Cart
   │
   ▼
Shopping Cart
   │
   ▼
Checkout
   │
   ▼
Order Confirmation
```

---


## 📚 Learning Outcomes

This project demonstrates

- React Native Fundamentals
- Expo Development
- TypeScript
- Context API
- React Navigation
- FlatList Optimization
- State Management
- Form Validation
- Search Functionality
- Product Filtering
- Mobile UI Design
- Component Reusability

---

## 🚀 Future Enhancements

- User Authentication
- Wishlist
- Backend API Integration
- Online Payment Gateway
- Order History
- Product Reviews
- Push Notifications
- Dark Mode
- Profile Management

---

## 📝 Development Notes

- Built using Expo SDK
- Uses TypeScript for type safety
- Context API manages global cart state
- Local JSON database for products and categories
- Optimized FlatList rendering for better performance
- Modular folder structure for scalability

---

## 📄 License

This project is developed for **educational and demonstration purposes**.
>>>>>>> e547e5e (Initial commit)
