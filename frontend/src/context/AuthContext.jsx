/* eslint-disable react-refresh/only-export-components */
// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import api, { setAuthToken } from "../api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(() => !!localStorage.getItem("token"));

  // İlk yüklemede localStorage'daki token varsa state'e yükle
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      setAuthToken(stored);
      setToken(stored);
      setIsAdmin(true);
    }
  }, []);

  // Token değiştiğinde axios header'ını güncelle
  useEffect(() => {
    if (token) {
      setAuthToken(token);
    }
  }, [token]);

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    const { accessToken } = data;
    localStorage.setItem("token", accessToken);
    setToken(accessToken);
    setIsAdmin(true); // hemen admin olarak işaretle
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setToken(null);
    setIsAdmin(false);
    window.location.href = "/admin";
  };

  return (
    <AuthContext.Provider value={{ isAdmin, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);
