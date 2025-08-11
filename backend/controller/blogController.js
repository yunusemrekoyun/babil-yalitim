const fs = require("fs/promises");
const Blog = require("../models/Blog");
const cloudinary = require("../config/cloudinary");

/* ------------ helpers ------------ */
const normalizeTags = (val) => {
  if (Array.isArray(val))
    return val
      .map(String)
      .map((s) => s.trim())
      .filter(Boolean);
  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        return parsed
          .map(String)
          .map((s) => s.trim())
          .filter(Boolean);
      }
    } catch {
      /* JSON değilse CSV say */
    }
    return val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

const uploadOne = async (file, folder) => {
  const isVideo = /^video\//i.test(file?.mimetype || "");
  const resourceType = isVideo ? "video" : "image";
  const options = {
    folder,
    resource_type: resourceType, // "image" | "video"
    overwrite: true,
    unique_filename: true,
    use_filename: true,
  };
  const filePath = file.path;
  let res;
  try {
    // tek API ile yeterli: video için de upload çoğu dosyada yeterlidir
    res = await cloudinary.uploader.upload(filePath, options);
  } finally {
    try {
      await fs.unlink(filePath);
    } catch {
      /* yut */
    }
  }
  return {
    url: res.secure_url || res.url,
    publicId: res.public_id,
    resourceType: res.resource_type,
    format: res.format,
    width: res.width,
    height: res.height,
    bytes: res.bytes,
    duration: res.duration,
  };
};

const destroyIfExists = async (m) => {
  if (!m?.publicId) return;
  try {
    await cloudinary.uploader.destroy(m.publicId, {
      resource_type: m.resourceType || "image",
    });
  } catch {
    /* sessiz geç */
  }
};

/* ------------ BLOG: public GET ------------ */
exports.getBlogs = async (_req, res) => {
  try {
    const items = await Blog.find().sort({ createdAt: -1 });
    // public listede yorumların tamamını göndermiyoruz (performans)
    const lean = items.map((b) => ({
      _id: b._id,
      title: b.title,
      content: b.content,
      tags: b.tags,
      cover: b.cover,
      assets: b.assets,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      commentsCount: (b.comments || []).filter((c) => c.approved).length,
    }));
    res.json(lean);
  } catch (err) {
    res.status(500).json({ message: "Bloglar alınamadı", error: err.message });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const b = await Blog.findById(req.params.id);
    if (!b) return res.status(404).json({ message: "Blog bulunamadı" });
    // public: SADECE onaylı yorumlar
    const approvedComments = (b.comments || []).filter((c) => c.approved);
    res.json({
      _id: b._id,
      title: b.title,
      content: b.content,
      tags: b.tags,
      cover: b.cover,
      assets: b.assets,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      comments: approvedComments,
    });
  } catch (err) {
    res.status(500).json({ message: "Blog alınamadı", error: err.message });
  }
};

/* ------------ BLOG: protected CREATE/UPDATE/DELETE ------------ */
// multipart: fields -> title, content, tags
// files: cover(1) required on create, assets(*) optional append
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const tags = normalizeTags(req.body.tags);
    const coverFile = req.files?.cover?.[0];

    if (!coverFile) {
      return res.status(400).json({ message: "Kapak görseli zorunludur." });
    }

    const folder = process.env.CLOUDINARY_BLOGS_FOLDER || "blogs";
    const cover = await uploadOne(coverFile, folder);

    let assets = [];
    if (Array.isArray(req.files?.assets) && req.files.assets.length) {
      assets = await Promise.all(
        req.files.assets.map((f) => uploadOne(f, `${folder}/assets`))
      );
    }

    const created = await Blog.create({
      title,
      content,
      tags,
      cover,
      assets,
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: "Blog eklenemedi", error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog bulunamadı" });

    const { title, content } = req.body;
    const tagsProvided = req.body.tags !== undefined;

    if (title !== undefined) blog.title = title;
    if (content !== undefined) blog.content = content;
    if (tagsProvided) blog.tags = normalizeTags(req.body.tags);

    const folder = process.env.CLOUDINARY_BLOGS_FOLDER || "blogs";

    // kapak REPLACE
    if (req.files?.cover?.[0]) {
      await destroyIfExists(blog.cover);
      blog.cover = await uploadOne(req.files.cover[0], folder);
    }

    // assets EKLE (image/video karışık)
    if (Array.isArray(req.files?.assets) && req.files.assets.length) {
      const uploaded = await Promise.all(
        req.files.assets.map((f) => uploadOne(f, `${folder}/assets`))
      );
      blog.assets = [...(blog.assets || []), ...uploaded];
    }

    const saved = await blog.save();
    res.json(saved);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Blog güncellenemedi", error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog bulunamadı" });

    await destroyIfExists(blog.cover);
    if (Array.isArray(blog.assets)) {
      await Promise.all(blog.assets.map(destroyIfExists));
    }

    await blog.deleteOne();
    res.json({ message: "Blog silindi" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Silme işlemi başarısız", error: err.message });
  }
};

// (opsiyonel) tek asset silme (publicId ile)
exports.deleteAsset = async (req, res) => {
  try {
    const { id, publicId } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ message: "Blog bulunamadı" });

    const idx = (blog.assets || []).findIndex((m) => m.publicId === publicId);
    if (idx === -1)
      return res.status(404).json({ message: "Ortam bulunamadı" });

    await destroyIfExists(blog.assets[idx]);
    blog.assets.splice(idx, 1);
    await blog.save();
    res.json({ message: "Ortam silindi", assets: blog.assets });
  } catch (err) {
    res.status(400).json({ message: "Ortam silinemedi", error: err.message });
  }
};

/* ------------ COMMENTS: public create / public list-approved / admin moderate ------------ */

// public: onaylı yorumları getir (tek blog için)
exports.getApprovedComments = async (req, res) => {
  try {
    const b = await Blog.findById(req.params.id).select("comments");
    if (!b) return res.status(404).json({ message: "Blog bulunamadı" });
    const approved = (b.comments || []).filter((c) => c.approved);
    res.json(approved);
  } catch (err) {
    res.status(500).json({ message: "Yorumlar alınamadı", error: err.message });
  }
};

// public: yorum gönder (ad, email, body) -> approved:false
exports.createComment = async (req, res) => {
  try {
    const { name, email, body } = req.body;
    if (!name || !email || !body) {
      return res
        .status(400)
        .json({ message: "Ad, e-posta ve yorum alanları zorunludur." });
    }
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog bulunamadı" });

    blog.comments.push({ name, email, body, approved: false });
    await blog.save();

    res.status(201).json({ message: "Yorum alındı, onay bekliyor." });
  } catch (err) {
    res.status(400).json({ message: "Yorum eklenemedi", error: err.message });
  }
};

// admin: tüm yorumları getir (approved fark etmeksizin)
exports.getAllComments = async (req, res) => {
  try {
    const b = await Blog.findById(req.params.id).select("comments title");
    if (!b) return res.status(404).json({ message: "Blog bulunamadı" });
    res.json({ blogId: b._id, title: b.title, comments: b.comments || [] });
  } catch (err) {
    res.status(500).json({ message: "Yorumlar alınamadı", error: err.message });
  }
};

// admin: yorum onayla / onayı kaldır
exports.setCommentApproval = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { approved } = req.body; // true/false
    const b = await Blog.findById(id);
    if (!b) return res.status(404).json({ message: "Blog bulunamadı" });

    const c = (b.comments || []).id(commentId);
    if (!c) return res.status(404).json({ message: "Yorum bulunamadı" });

    c.approved = Boolean(approved);
    await b.save();
    res.json({ message: "Güncellendi", comment: c });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Yorum güncellenemedi", error: err.message });
  }
};

// admin: yorumu sil
exports.deleteComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const b = await Blog.findById(id);
    if (!b) return res.status(404).json({ message: "Blog bulunamadı" });

    const c = (b.comments || []).id(commentId);
    if (!c) return res.status(404).json({ message: "Yorum bulunamadı" });

    c.remove();
    await b.save();
    res.json({ message: "Yorum silindi" });
  } catch (err) {
    res.status(400).json({ message: "Yorum silinemedi", error: err.message });
  }
};
