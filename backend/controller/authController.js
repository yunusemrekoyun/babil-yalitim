// backend/controller/authController.js
const jwt = require("jsonwebtoken");
// gerçek projede kullanıcı veritabanı vs. kontrol edilir
const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
const JWT_SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const accessToken = jwt.sign({ username, role: "admin" }, JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ accessToken });
  }
  res.status(401).json({ message: "Kullanıcı adı veya şifre hatalı" });
};


