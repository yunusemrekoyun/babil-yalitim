// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import GuestRoute from "./context/GuestRoute.jsx";
import PrivateRoute from "./context/PrivateRoute.jsx";
import Login from "./admin/pages/Login";
import AdminLayout from "./admin/components/AdminLayout";
import * as PublicPages from "../src/pages/index.jsx";
import * as AdminPages from "../src/admin/pages/index.jsx";

const publicRoutes = [
  { path: "/", element: <PublicPages.HomePage /> },
  { path: "/projects", element: <PublicPages.ProjectsPage /> },
  { path: "/project-detail/:id", element: <PublicPages.ProjectDetailPage /> },
  { path: "/services", element: <PublicPages.ExplorePage /> },
  { path: "/journal", element: <PublicPages.JournalPage /> },
  { path: "/journals/:id", element: <PublicPages.JournalDetailPage /> },
  { path: "/whyus", element: <PublicPages.WhyUsPage /> },
  { path: "/about", element: <PublicPages.AboutPage /> },
  { path: "/blog", element: <PublicPages.BlogPage /> },
  { path: "/blog/:id", element: <PublicPages.BlogDetailPage /> },
  { path: "/iletisim", element: <PublicPages.ContactPage /> }, // 📩 Yeni route eklendi
  
];

const adminRoutes = [
  { path: "dashboard", element: <AdminPages.Dashboard /> },
  { path: "blogs", element: <AdminPages.BlogList /> },
  { path: "blogs/add", element: <AdminPages.AddBlog /> },
  { path: "blogs/edit/:id", element: <AdminPages.EditBlog /> },
  { path: "journals", element: <AdminPages.JournalList /> },
  { path: "journals/add", element: <AdminPages.AddJournal /> },
  { path: "journals/edit/:id", element: <AdminPages.EditJournal /> },
  { path: "projects", element: <AdminPages.ProjectList /> },
  { path: "projects/add", element: <AdminPages.AddProject /> },
  { path: "projects/edit/:id", element: <AdminPages.EditProject /> },
  { path: "services", element: <AdminPages.ServiceList /> },
  { path: "services/add", element: <AdminPages.AddService /> },
  { path: "services/edit/:id", element: <AdminPages.EditService /> },
];

const AppRoutes = () => (
  <AnimatePresence mode="wait">
    <Routes>
      {/* 🌐 Public Routes */}
      {publicRoutes.map(({ path, element }) => (
        <Route key={path} path={path} element={element} />
      ))}

      {/* 🔐 Login (Guest only) */}
      <Route
        path="/admin"
        element={
          <GuestRoute>
            <Login />
          </GuestRoute>
        }
      />

      {/* 🔒 Admin (Protected) */}
      {adminRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={`/admin/${path}`}
          element={
            <PrivateRoute>
              <AdminLayout>{element}</AdminLayout>
            </PrivateRoute>
          }
        />
      ))}
    </Routes>
  </AnimatePresence>
);

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}