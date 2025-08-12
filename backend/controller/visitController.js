// backend/controller/visitController.js
const Visit = require("../models/Visit");
const geoip = require("geoip-lite");
const UAParser = require("ua-parser-js");
const { v4: uuidv4 } = require("uuid");

function guessSection(path = "") {
  if (!path) return "other";
  if (path.startsWith("/blog")) return "blog";
  if (path.startsWith("/journal")) return "journal";
  if (path.startsWith("/projects")) return "projects";
  if (path.startsWith("/services")) return "services";
  if (path === "/") return "home";
  return "other";
}

function extractClientIp(req) {
  const xf = req.headers["x-forwarded-for"];
  if (xf && typeof xf === "string") {
    return xf.split(",")[0].trim();
  }
  return req.ip || req.connection?.remoteAddress || undefined;
}

const recordVisit = async (req, res) => {
  try {
    const consent = String(
      req.headers["x-analytics-consent"] || ""
    ).toLowerCase();
    if (consent !== "true") return res.status(204).end();

    let sessionId = req.headers["x-session-id"];
    if (!sessionId) sessionId = uuidv4();

    const { path, duration, scrollDepth, section, userId } = req.body;
    const ip = extractClientIp(req);

    const geo = ip ? geoip.lookup(ip) : null;
    const ua = new UAParser(req.headers["user-agent"]).getResult();

    const visit = await Visit.create({
      sessionId,
      userId: userId || null,
      ip: ip || null,
      country: geo?.country || null,
      city: geo?.city || null,
      path: path || "/",
      referrer: req.get("referer") || null,
      userAgent: req.headers["user-agent"] || null,
      browser: ua.browser?.name || null,
      os: ua.os?.name || null,
      device: ua.device?.type || "desktop",
      duration: Number.isFinite(duration) ? duration : 0,
      scrollDepth: Number.isFinite(scrollDepth) ? scrollDepth : 0,
      section: section || guessSection(path),
    });

    res.setHeader("x-session-id", sessionId);
    res.status(201).json({ visit, sessionId });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Ziyaret kaydedilemedi",
        error: error?.message || error,
      });
  }
};

const getAllVisits = async (req, res) => {
  try {
    const { from, to, section, device, country, path, limit = 200 } = req.query;
    const q = {};

    if (from || to) {
      q.createdAt = {};
      if (from) q.createdAt.$gte = new Date(from);
      if (to) q.createdAt.$lte = new Date(to);
    }
    if (section) q.section = section;
    if (device) q.device = device;
    if (country) q.country = country;
    if (path) q.path = path.startsWith("/") ? path : `/${path}`;

    const docs = await Visit.find(q)
      .sort({ createdAt: -1 })
      .limit(Math.min(Number(limit) || 200, 2000));

    res.json(docs);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Ziyaretler getirilemedi",
        error: error?.message || error,
      });
  }
};

const getVisitCountByPath = async (req, res) => {
  try {
    const p = `/${(req.params.path || "").replace(/^\/+/, "")}`;
    const count = await Visit.countDocuments({ path: p });
    res.json({ path: p, count });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Ziyaret sayısı alınamadı",
        error: error?.message || error,
      });
  }
};

const getSummary = async (req, res) => {
  try {
    const { from, to } = req.query;
    const match = {};
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const [totals] = await Visit.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          avgDuration: { $avg: "$duration" },
          avgScroll: { $avg: "$scrollDepth" },
        },
      },
    ]);

    const bySection = await Visit.aggregate([
      { $match: match },
      { $group: { _id: "$section", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const byDevice = await Visit.aggregate([
      { $match: match },
      { $group: { _id: "$device", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      total: totals?.total || 0,
      avgDuration: Math.round(totals?.avgDuration || 0),
      avgScroll: Math.round(totals?.avgScroll || 0),
      bySection,
      byDevice,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Özet getirilemedi", error: error?.message || error });
  }
};

const getTopPages = async (req, res) => {
  try {
    const { from, to, limit = 10 } = req.query;
    const match = {};
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const top = await Visit.aggregate([
      { $match: match },
      { $group: { _id: "$path", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: Math.min(Number(limit) || 10, 100) },
    ]);

    res.json(top.map((x) => ({ path: x._id, count: x.count })));
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Popüler sayfalar getirilemedi",
        error: error?.message || error,
      });
  }
};

const getTimeseries = async (req, res) => {
  try {
    const { from, to } = req.query;
    const match = {};
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    const series = await Visit.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            y: { $year: "$createdAt" },
            m: { $month: "$createdAt" },
            d: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
    ]);

    const formatted = series.map((r) => ({
      date: `${r._id.y}-${String(r._id.m).padStart(2, "0")}-${String(
        r._id.d
      ).padStart(2, "0")}`,
      count: r.count,
    }));

    res.json(formatted);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Zaman serisi getirilemedi",
        error: error?.message || error,
      });
  }
};

module.exports = {
  recordVisit,
  getAllVisits,
  getVisitCountByPath,
  getSummary,
  getTopPages,
  getTimeseries,
};
