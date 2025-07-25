import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// 👥 Public Sayfalar
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ExplorePage from "./pages/ExplorePage";
import JournalPage from "./pages/JournalPage";
import WhyUsPage from "./pages/WhyUsPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import JournalDetailPage from "./pages/JournalDetailPage";
import BlogDetailPage from "./pages/BlogDetailPage";

// 🔐 Admin Sayfaları
import Login from "./admin/pages/Login";
import Dashboard from "./admin/pages/Dashboard";
import AdminLayout from "./admin/components/AdminLayout";
import BlogList from "./admin/pages/blog/BlogList";
import AddBlog from "./admin/pages/blog/AddBlog";
import EditBlog from "./admin/pages/blog/EditBlog";

// 🔁 Route Animasyonları
const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/services" element={<ExplorePage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/journal/:id" element={<JournalDetailPage />} />
        <Route path="/whyus" element={<WhyUsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />

        {/* 🔐 Admin Routes */}
        <Route
          path="/admin"
          element={isAdmin ? <Navigate to="/admin/dashboard" /> : <Login />}
        />
        <Route
          path="/admin/dashboard"
          element={
            isAdmin ? (
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/blogs"
          element={
            isAdmin ? (
              <AdminLayout>
                <BlogList />
              </AdminLayout>
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/blogs/add"
          element={
            isAdmin ? (
              <AdminLayout>
                <AddBlog />
              </AdminLayout>
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/blogs/edit/:id"
          element={
            isAdmin ? (
              <AdminLayout>
                <EditBlog />
              </AdminLayout>
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
};

export default App;