import { createContext, useContext, useEffect, useMemo, useState } from 'react';
const WishlistContext = createContext(null);
const KEY = 'sugar_stones_wishlist';
const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(read);
  useEffect(() => localStorage.setItem(KEY, JSON.stringify(wishlist)), [wishlist]);
  const toggleWishlist = product => setWishlist(current => current.some(p => p.id === product.id) ? current.filter(p => p.id !== product.id) : [...current, product]);
  const isWishlisted = id => wishlist.some(p => p.id === id);
  const count = useMemo(() => wishlist.length, [wishlist]);
  return <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, count }}>{children}</WishlistContext.Provider>;
}
export const useWishlist = () => useContext(WishlistContext);
