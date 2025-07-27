// src/context/GuestRoute.jsx

import { useAuth } from "./AuthContext.jsx";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

const GuestRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  // Zaten girişli ise önceki sayfaya veya dashboard’a
  if (isAdmin) {
    const from = location.state?.from?.pathname || "/admin/dashboard";
    return <Navigate to={from} replace />;
  }

  return children;
};

export default GuestRoute;
GuestRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
