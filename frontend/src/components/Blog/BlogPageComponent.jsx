// src/components/Blog/BlogPageComponent.jsx

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

const BlogPageComponent = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/blogs")
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error("Bloglar alınamadı:", err));
  }, []);

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full px-4 md:px-12 mb-10">
      {blogs.map((item, index) => (
        <motion.div
          key={item._id}
          onClick={() => navigate(`/blog/${item._id}`)}
          className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer flex flex-col duration-300 border border-white/30 hover:scale-[1.02]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Görsel */}
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-56 object-cover"
          />

          {/* İçerik */}
          <div className="p-5 flex flex-col justify-between h-full">
            <h3 className="text-lg font-semibold text-secondaryColor mb-2 line-clamp-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-800 line-clamp-3 mb-4">
              {item.about}
            </p>
            <p className="text-xs text-right text-gray-500 mt-auto">
              {new Date(item.createdAt).toLocaleDateString("tr-TR")}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BlogPageComponent;