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

// 📄 Blog Admin
import BlogList from "./admin/pages/blog/BlogList";
import AddBlog from "./admin/pages/blog/AddBlog";
import EditBlog from "./admin/pages/blog/EditBlog";

// 📓 Journal Admin
import JournalList from "./admin/pages/journal/JournalList";
import AddJournal from "./admin/pages/journal/AddJournal";
import EditJournal from "./admin/pages/journal/EditJournal";

// 🏗️ Project Admin
import ProjectList from "./admin/pages/project/ProjectList";
import AddProject from "./admin/pages/project/AddProject";
import EditProject from "./admin/pages/project/EditProject";
// 🔧 Service Admin Sayfaları (import'ların arasına ekle)
import ServiceList from "./admin/pages/service/ServiceList";
import AddService from "./admin/pages/service/AddService";
import EditService from "./admin/pages/service/EditService";
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

        {/* 📝 Blog Admin */}
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

        {/* 📓 Journal Admin */}
        <Route
          path="/admin/journals"
          element={
            isAdmin ? (
              <AdminLayout>
                <JournalList />
              </AdminLayout>
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/journals/add"
          element={
            isAdmin ? (
              <AdminLayout>
                <AddJournal />
              </AdminLayout>
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/journals/edit/:id"
          element={
            isAdmin ? (
              <AdminLayout>
                <EditJournal />
              </AdminLayout>
            ) : (
              <Navigate to="/admin" />
            )
          }
        />

        {/* 🏗️ Project Admin */}
        <Route
          path="/admin/projects"
          element={
            isAdmin ? (
              <AdminLayout>
                <ProjectList />
              </AdminLayout>
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/projects/add"
          element={
            isAdmin ? (
              <AdminLayout>
                <AddProject />
              </AdminLayout>
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/projects/edit/:id"
          element={
            isAdmin ? (
              <AdminLayout>
                <EditProject />
              </AdminLayout>
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        {/* ✅ Service Routes */}
        <Route
          path="/admin/services"
          element={
            isAdmin ? (
              <AdminLayout>
                <ServiceList />
              </AdminLayout>
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/services/add"
          element={
            isAdmin ? (
              <AdminLayout>
                <AddService />
              </AdminLayout>
            ) : (
              <Navigate to="/admin" />
            )
          }
        />
        <Route
          path="/admin/services/edit/:id"
          element={
            isAdmin ? (
              <AdminLayout>
                <EditService />
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
