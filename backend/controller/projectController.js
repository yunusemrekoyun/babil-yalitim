const fs = require("fs/promises");
const Project = require("../models/Project");
const cloudinary = require("../config/cloudinary");

/* ---------- helpers ---------- */
const extractPublicIdFromUrl = (fullUrl) => {
  try {
    if (!fullUrl) return null;
    const u = new URL(fullUrl);
    const parts = u.pathname.split("/").filter(Boolean);
    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx === -1 || uploadIdx + 1 >= parts.length) return null;
    let after = parts.slice(uploadIdx + 1);
    if (/^v\d+$/i.test(after[0])) after = after.slice(1);
    const publicIdWithExt = after.join("/");
    const lastDot = publicIdWithExt.lastIndexOf(".");
    const withoutExt =
      lastDot > -1 ? publicIdWithExt.slice(0, lastDot) : publicIdWithExt;
    return decodeURIComponent(withoutExt);
  } catch {
    return null;
  }
};

const makeDeliveryUrl = (publicId, resourceType, extra = {}) =>
  cloudinary.url(publicId, {
    resource_type: resourceType,
    secure: true,
    transformation: [{ fetch_format: "auto", quality: "auto" }],
    ...extra,
  });

const toMediaDoc = (cldRes, fallbackType) => {
  const resourceType = cldRes?.resource_type || fallbackType || "image";
  const fromApi = cldRes?.public_id || cldRes?.publicId || null;
  const fromUrl =
    extractPublicIdFromUrl(cldRes?.secure_url) ||
    extractPublicIdFromUrl(cldRes?.url);
  const publicId = fromApi || fromUrl || cldRes?.asset_id || null;

  if (!publicId) {
    throw new Error(
      `Upload result missing required fields (publicId:undefined, resourceType:${resourceType})`
    );
  }

  const url =
    cldRes?.secure_url ||
    cldRes?.url ||
    makeDeliveryUrl(publicId, resourceType);

  return {
    publicId,
    url,
    resourceType,
    format: cldRes?.format,
    width: cldRes?.width,
    height: cldRes?.height,
    bytes: cldRes?.bytes,
    duration: cldRes?.duration,
  };
};

const uploadOne = async (file, folder, forceType) => {
  const isVideo =
    forceType === "video" ||
    /^video\//i.test(file?.mimetype || "") ||
    (!/^image\//i.test(file?.mimetype || "") && forceType !== "image");

  const resourceType = isVideo ? "video" : "image";

  const options = {
    folder,
    resource_type: resourceType,
    overwrite: true,
    unique_filename: true,
    use_filename: true,
    chunk_size: 6_000_000,
  };

  const filePath = file.path;

  try {
    const result = await cloudinary.uploader.upload(filePath, options);
    return toMediaDoc(result, resourceType);
  } finally {
    try {
      await fs.unlink(filePath);
    } catch {}
  }
};

// Tarih parse helper
const parseDate = (v) => {
  if (v === undefined || v === null) return undefined;
  if (typeof v === "string" && v.trim() === "") return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d;
};

/* ---------- GET ---------- */
exports.getProjects = async (req, res) => {
  try {
    const items = await Project.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const item = await Project.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Proje bulunamadı" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ---------- CREATE ---------- */
exports.createProject = async (req, res) => {
  try {
    const { title, description, category, startDate, endDate, completedAt } =
      req.body;

    const files = req.files || {};
    const coverFile = files.cover?.[0];
    if (!coverFile) {
      return res.status(400).json({ message: "Kapak medyası zorunludur." });
    }

    const folder = process.env.CLOUDINARY_PROJECTS_FOLDER || "babil/projects";

    const cover = await uploadOne(coverFile, folder, null);

    let video;
    if (files.video?.[0]) {
      video = await uploadOne(files.video[0], folder, "video");
    }

    let images = [];
    if (Array.isArray(files.images) && files.images.length) {
      const limited = files.images.slice(0, 4);
      images = await Promise.all(
        limited.map((f) => uploadOne(f, folder, "image"))
      );
    }

    const payload = {
      title,
      description,
      category,
      cover,
      video,
      images,
      startDate: parseDate(startDate),
      endDate: parseDate(endDate),
      completedAt: parseDate(completedAt),
    };

    if (!payload.completedAt && payload.endDate) {
      payload.completedAt = payload.endDate;
    }

    const created = await Project.create(payload);
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({
      message: "Proje eklenemedi",
      error: err?.message || String(err),
    });
  }
};

/* ---------- UPDATE ---------- */
exports.updateProject = async (req, res) => {
  try {
    const { title, description, category, startDate, endDate, completedAt } =
      req.body;

    const proj = await Project.findById(req.params.id);
    if (!proj) return res.status(404).json({ message: "Proje bulunamadı" });

    const files = req.files || {};
    const folder = process.env.CLOUDINARY_PROJECTS_FOLDER || "babil/projects";

    if (title !== undefined) proj.title = title;
    if (description !== undefined) proj.description = description;
    if (category !== undefined) proj.category = category;
    if (startDate !== undefined) proj.startDate = parseDate(startDate);
    if (endDate !== undefined) proj.endDate = parseDate(endDate);
    if (completedAt !== undefined) proj.completedAt = parseDate(completedAt);

    if (files.cover?.[0]) {
      if (proj.cover?.publicId) {
        await cloudinary.uploader.destroy(proj.cover.publicId, {
          resource_type: proj.cover.resourceType || "image",
        });
      }
      proj.cover = await uploadOne(files.cover[0], folder, null);
    }

    if (files.video?.[0]) {
      if (proj.video?.publicId) {
        await cloudinary.uploader.destroy(proj.video.publicId, {
          resource_type: "video",
        });
      }
      proj.video = await uploadOne(files.video[0], folder, "video");
    }

    if (Array.isArray(files.images) && files.images.length) {
      const canAdd = Math.max(0, 4 - (proj.images?.length || 0));
      if (canAdd > 0) {
        const toAdd = files.images.slice(0, canAdd);
        const uploaded = await Promise.all(
          toAdd.map((f) => uploadOne(f, folder, "image"))
        );
        proj.images = [...(proj.images || []), ...uploaded];
      }
    }

    const saved = await proj.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({
      message: "Proje güncellenemedi",
      error: err?.message || String(err),
    });
  }
};

exports.getProjectCovers = async (req, res) => {
  try {
    // Sadece gerekli alanları çek (performans)
    const items = await Project.find(
      {},
      {
        _id: 1,
        title: 1,
        // cover detayları
        "cover.url": 1,
        "cover.resourceType": 1,
        "cover.publicId": 1,
        // images sadece ilkini alalım
        images: { $slice: 1 },
        // video detayları
        "video.publicId": 1,
        "video.url": 1,
      }
    )
      .sort({ createdAt: -1 })
      .lean();

    const mapped = items.map((p) => {
      let mobileCoverUrl = null;

      // 1) cover image ise direkt onu kullan
      if (p?.cover?.resourceType === "image" && p.cover.url) {
        mobileCoverUrl = p.cover.url;
      }

      // 2) değilse images[0] varsa onu kullan
      if (!mobileCoverUrl) {
        const firstImg =
          Array.isArray(p.images) && p.images.length ? p.images[0] : null;
        if (firstImg?.url) {
          mobileCoverUrl = firstImg.url;
        }
      }

      // 3) hâlâ yoksa video posteri üret
      if (!mobileCoverUrl && p?.video?.publicId) {
        // Cloudinary: video’dan jpg poster
        // format: 'jpg' + start_offset '0' (ilk kare)
        mobileCoverUrl = cloudinary.url(p.video.publicId, {
          resource_type: "video",
          format: "jpg",
          secure: true,
          transformation: [{ quality: "auto" }, { start_offset: "0" }],
        });
      }

      return {
        _id: p._id,
        title: p.title,
        mobileCoverUrl, // <-- sadece mobilde bunu kullanacağız
      };
    });

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
/* ---------- DELETE ---------- */
exports.deleteProject = async (req, res) => {
  try {
    const proj = await Project.findById(req.params.id);
    if (!proj) return res.status(404).json({ message: "Proje bulunamadı" });

    const destroyOne = async (m) => {
      if (!m?.publicId) return;
      try {
        await cloudinary.uploader.destroy(m.publicId, {
          resource_type: m.resourceType || "image",
        });
      } catch {}
    };

    await destroyOne(proj.cover);
    await destroyOne(proj.video);
    if (Array.isArray(proj.images)) {
      await Promise.all(proj.images.map(destroyOne));
    }

    await proj.deleteOne();
    res.json({ message: "Proje silindi" });
  } catch (err) {
    res.status(500).json({ message: "Silme başarısız", error: err.message });
  }
};
