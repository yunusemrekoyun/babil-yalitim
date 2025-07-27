// src/context/PrivateRoute.jsx
import { useAuth } from "./AuthContext.jsx";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const PrivateRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  if (!isAdmin) {
    // Giriş yoksa login sayfasına, mevcut konumu koru
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  return children;
};

export default PrivateRoute;
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
