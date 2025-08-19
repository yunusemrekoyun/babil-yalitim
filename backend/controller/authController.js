// backend/controller/authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
const ADMIN_PASS_HASH = process.env.ADMIN_PASS_HASH;
const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRES_IN =
  process.env.ACCESS_TOKEN_EXPIRES_IN?.trim() || "1h";

// cookie için ortak ayarlar (Railway + Vercel farklı domainlerdeyse SameSite=None + Secure şart)
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined; // örn: .senindomainin.com
const CROSS_SITE = process.env.CROSS_SITE_COOKIES === "1"; // farklı domainse 1 yap
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: CROSS_SITE ? true : process.env.NODE_ENV === "production",
  sameSite: CROSS_SITE ? "none" : "lax",
  path: "/",
  domain: COOKIE_DOMAIN, // genelde boş bırakılır; çoklu subdomain varsa ayarla
};

async function verifyPassword(plain, { plainEnv, hashEnv }) {
  if (hashEnv?.trim()) {
    try {
      return await bcrypt.compare(plain, hashEnv.trim());
    } catch {
      return false;
    }
  }
  if (plainEnv?.trim()) return plain === plainEnv.trim();
  return false;
}

exports.login = async (req, res) => {
  try {
    if (!ADMIN_USER || !JWT_SECRET) {
      return res.status(500).json({
        message: "Sunucu yapılandırma hatası: ADMIN_USER/JWT_SECRET eksik.",
      });
    }

    const { username = "", password = "" } = req.body || {};
    if (username !== ADMIN_USER) {
      return res
        .status(401)
        .json({ message: "Kullanıcı adı veya şifre hatalı" });
    }

    const ok = await verifyPassword(password, {
      plainEnv: ADMIN_PASS,
      hashEnv: ADMIN_PASS_HASH,
    });
    if (!ok) {
      return res
        .status(401)
        .json({ message: "Kullanıcı adı veya şifre hatalı" });
    }

    // JWT üret
    const accessToken = jwt.sign({ username, role: "admin" }, JWT_SECRET, {
      expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });

    // CSRF token üret ve ayrı cookie'ye yaz
    const csrfToken = crypto.randomBytes(24).toString("hex");

    // JWT -> httpOnly cookie
    res.cookie("accessToken", accessToken, {
      ...COOKIE_OPTIONS,
      maxAge: 1000 * 60 * 60 * 12, // 12 saat cookie ömrü (JWT exp ayrı)
    });

    // CSRF -> normal cookie (JS okuyabilir); header ile eşleşecek
    res.cookie("csrfToken", csrfToken, {
      // httpOnly: false default (JS erişsin)
      secure: COOKIE_OPTIONS.secure,
      sameSite: COOKIE_OPTIONS.sameSite,
      path: "/",
      domain: COOKIE_OPTIONS.domain,
      maxAge: 1000 * 60 * 60 * 12,
    });

    // Body’de yalnızca csrfToken dönüyoruz (token dönmüyoruz)
    return res.json({ csrfToken });
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "Giriş işlemi başarısız" });
  }
};

exports.me = async (req, res) => {
  // verifyToken geçmişse req.user dolu olur
  return res.json({ user: req.user || null });
};

exports.logout = async (req, res) => {
  // Cookie’leri sil
  res.clearCookie("accessToken", {
    ...COOKIE_OPTIONS,
  });
  res.clearCookie("csrfToken", {
    secure: COOKIE_OPTIONS.secure,
    sameSite: COOKIE_OPTIONS.sameSite,
    path: "/",
    domain: COOKIE_OPTIONS.domain,
  });
  return res.json({ ok: true });
};
