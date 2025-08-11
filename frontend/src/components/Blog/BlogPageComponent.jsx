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
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
      {blogs.map((item, index) => (
        <motion.div
          key={item._id}
          onClick={() => navigate(`/blog/${item._id}`)}
          className="group bg-white/60 backdrop-blur-xl rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all cursor-pointer flex flex-col duration-300 border border-white/30 hover:scale-[1.02]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Görsel */}
          <div className="overflow-hidden">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* İçerik */}
          <div className="p-5 flex flex-col h-full">
            <h3 className="text-lg font-semibold text-secondaryColor mb-2 line-clamp-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-700 line-clamp-3 flex-grow">
              {item.about}
            </p>
            <p className="text-xs text-right text-gray-500 mt-4">
              {new Date(item.createdAt).toLocaleDateString("tr-TR")}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default BlogPageComponent;
