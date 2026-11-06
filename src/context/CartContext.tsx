/**
 * @file CartContext.tsx
 * @description Global state manager for the shopping cart with strict stock limit validation and item removal.
 */

import React, { createContext, useState, useContext } from 'react';

export type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  rating: number;
  stock: number;
};

type CartItem = Product & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateQuantity: (id: string, amount: number) => void;
  removeFromCart: (id: string) => void;
  cartTotal: number;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    // Prevent adding if item is out of stock[cite: 10, 16]
    if (product.stock <= 0) return;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id || item.name === product.name);
      if (existing) {
        // Prevent adding beyond maximum stock limit[cite: 10, 16]
        if (existing.quantity >= product.stock) {
          return prev;
        }
        return prev.map((item) =>
          item.id === product.id || item.name === product.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (idOrName: string, amount: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === idOrName || item.name === idOrName) {
            const newQty = item.quantity + amount;
            // Ensure quantity never exceeds product stock limit[cite: 10, 16]
            if (newQty > item.stock) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  // NEW: Immediately remove an item from the cart
  const removeFromCart = (idOrName: string) => {
    setCart((prev) =>
      prev.filter((item) => item.id !== idOrName && item.name !== idOrName)
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, cartTotal, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};