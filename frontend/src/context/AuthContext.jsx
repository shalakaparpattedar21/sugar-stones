import { createContext, useContext, useEffect, useState } from 'react';
import { login as loginApi, signup as signupApi, getMe } from '../api/authApi';
import { getMyOrders } from '../api/orderApi';
import { setAuthToken } from '../api/api';

const AuthContext = createContext(null);
const TOKEN_KEY = 'sugar_stones_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshOrders = async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setOrders([]);
      return;
    }
    try {
      setAuthToken(token);
      setOrders(await getMyOrders());
    } catch {
      setOrders([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }

    setAuthToken(token);
    getMe()
      .then(data => setUser(data))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setAuthToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user) refreshOrders();
  }, [user]);

  const register = async ({ name, email, password, phone }) => {
    const data = await signupApi({ name, email, password, phone });
    localStorage.setItem(TOKEN_KEY, data.token);
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const login = async ({ email, password }) => {
    const data = await loginApi({ email, password });
    localStorage.setItem(TOKEN_KEY, data.token);
    setAuthToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setAuthToken(null);
    setUser(null);
    setOrders([]);
  };

  const saveOrder = order => setOrders(current => [order, ...current]);

  return (
    <AuthContext.Provider value={{
      user,
      orders,
      loading,
      register,
      login,
      logout,
      saveOrder,
      refreshOrders
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
