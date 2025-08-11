const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
// Not: Projede hem diskStorage hem memoryStorage varyantların var.
// Bu controller hem buffer hem path ile çalışır; mevcut “uploadMedia” (image|video izinli) işini görür.
const upload = require("../middleware/uploadMedia");

const {
  getJournals,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
  deleteAsset,
  likeJournal,
  getLikesCount,
} = require("../controller/journalController");

// public
router.get("/", getJournals);
router.get("/:id", getJournalById);
router.get("/:id/likes", getLikesCount);
router.post("/:id/like", likeJournal);

// admin (multipart)
router.post(
  "/",
  verifyToken,
  upload.fields([
    { name: "cover", maxCount: 1 }, // zorunlu (image)
    { name: "assets", maxCount: 20 }, // opsiyonel (image|video çoklu)
  ]),
  createJournal
);

router.put(
  "/:id",
  verifyToken,
  upload.fields([
    { name: "cover", maxCount: 1 }, // REPLACE
    { name: "assets", maxCount: 20 }, // APPEND
  ]),
  updateJournal
);

router.delete("/:id", verifyToken, deleteJournal);

// opsiyonel: tek asset sil
router.delete("/:id/assets/:publicId", verifyToken, deleteAsset);

module.exports = router;
