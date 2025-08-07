const Blog = require("../models/Blog");
const Journal = require("../models/Journal");
const Project = require("../models/Project");
const Service = require("../models/Service");

const searchAll = async (req, res) => {
  const query = req.query.q;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Arama sorgusu boş olamaz." });
  }

  const regex = new RegExp(query, "i"); // büyük küçük harf duyarsız ve eksik eşleşme

  try {
    const blogs = await Blog.find({ title: regex }).select("title _id");
    const journals = await Journal.find({ title: regex }).select("title _id");
    const projects = await Project.find({ title: regex }).select("title _id");
    const services = await Service.find({ title: regex }).select("title _id");

    res.json({
      blogs,
      journals,
      projects,
      services,
    });
  } catch (error) {
    console.error("Arama hatası:", error);
    res.status(500).json({ message: "Arama yapılırken hata oluştu." });
  }
};

module.exports = { searchAll };