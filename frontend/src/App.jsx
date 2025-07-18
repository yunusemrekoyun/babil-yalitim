import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// Sayfalar
import HomePage from "./pages/HomePage";
import ProjectsPage from "./pages/ProjectsPage";
import ExplorePage from "./pages/ExplorePage";
import JournalPage from "./pages/JournalPage";
import WhyUsPage from "./pages/WhyUsPage";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import JournalDetailPage from "./pages/JournalDetailPage"; // ✅ EKLENDİ
import BlogDetailPage from "./pages/BlogDetailPage";

// Route geçişleri için iç bileşen
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/services" element={<ExplorePage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/journal/:id" element={<JournalDetailPage />} /> {/* ✅ EKLENDİ */}
        <Route path="/whyus" element={<WhyUsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:id" element={<BlogDetailPage />} />
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