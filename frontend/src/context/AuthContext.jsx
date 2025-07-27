/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import api, { setAuthToken } from "../api.js";

const AuthContext = createContext();

// Küçük bir JWT ayrıştırıcı (payload'ı base64'ten JSON'a çevirir)
function parseJWT(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(() => !!localStorage.getItem("token"));
  const logoutTimerRef = useRef(null);

  const scheduleLogout = (tkn) => {
    const payload = parseJWT(tkn);
    if (!payload?.exp) return;
    const now = Date.now() / 1000;
    const secsLeft = payload.exp - now;
    if (secsLeft <= 0) {
      logout();
    } else {
      logoutTimerRef.current = setTimeout(logout, secsLeft * 1000);
    }
  };

  const login = async (username, password) => {
    const { data } = await api.post("/auth/login", { username, password });
    const { accessToken } = data;
    localStorage.setItem("token", accessToken);
    setAuthToken(accessToken);
    setToken(accessToken);
    setIsAdmin(true);
    scheduleLogout(accessToken);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setToken(null);
    setIsAdmin(false);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    window.location.href = "/admin";
  };

  // İlk açılışta localStorage'dan token varsa yükle ve zamanlayıcı kur
  useEffect(() => {
    const stored = localStorage.getItem("token");
    if (stored) {
      setAuthToken(stored);
      setToken(stored);
      setIsAdmin(true);
      scheduleLogout(stored);
    }
  }, []);

  // token her değiştiğinde axios header'ını güncelle
  useEffect(() => {
    if (token) setAuthToken(token);
  }, [token]);

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
