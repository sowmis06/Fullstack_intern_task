const express = require("express");
const {
  getFavorites,
  addFavorite,
  removeFavorite,
} = require("../controllers/favoriteController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);

router.get("/", getFavorites);
router.post("/:templateId", addFavorite);
router.delete("/:templateId", removeFavorite);

module.exports = router;
