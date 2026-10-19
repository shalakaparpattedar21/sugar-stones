import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const CART_KEY = 'sugar_stones_cart';

function readCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(readCart);

  useEffect(() => localStorage.setItem(CART_KEY, JSON.stringify(cart)), [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(current => {
      const found = current.find(item => item.id === product.id);
      if (found) return current.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      return [...current, { ...product, quantity }];
    });
  };
  const updateQuantity = (id, quantity) => setCart(current => current.map(item => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item));
  const removeFromCart = id => setCart(current => current.filter(item => item.id !== id));
  const clearCart = () => setCart([]);
  const buyNow = (product, quantity = 1) => setCart([{ ...product, quantity }]);
  const itemCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  return <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, buyNow, itemCount, subtotal }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
