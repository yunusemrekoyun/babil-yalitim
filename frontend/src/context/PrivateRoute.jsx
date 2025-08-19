import { useAuth } from "./AuthContext.jsx";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";

/** Admin paneli koruması: /admin/* */
const PrivateRoute = ({ children }) => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  if (!isAdmin) {
    // Giriş yoksa login sayfasına, mevcut konumu koru
    return <Navigate to="/admin" replace state={{ from: location }} />;
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
