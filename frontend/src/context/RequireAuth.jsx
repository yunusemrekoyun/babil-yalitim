// src/context/RequireAuth.jsx

import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

const RequireAuth = ({ children }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  if (!isAdmin) {
    // login sayfasına yönlendirirken, orijinal yolu da state ile bırak
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }
  return children;
};
RequireAuth.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RequireAuth;
