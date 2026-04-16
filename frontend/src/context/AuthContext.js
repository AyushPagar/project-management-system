import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();
const API_BASE_URL = "http://localhost:5000/api/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      return;
    }

    localStorage.removeItem("user");
  }, [user]);

  const register = async (userData) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/register`, userData);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      console.error(err.response?.data || err.message);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/login`, { email, password });
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      console.error(err.response?.data || err.message);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
