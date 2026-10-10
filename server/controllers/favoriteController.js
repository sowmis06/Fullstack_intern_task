const db = require("../config/db");
const { parseId, formatTemplate } = require("../utils/helpers");

async function getFavorites(req, res, next) {
  try {
    const rows = await db("favorites")
      .join("templates", "favorites.template_id", "templates.id")
      .where("favorites.user_id", req.user.id)
      .orderBy("favorites.id", "desc")
      .select("templates.*");

    res.json(rows.map(formatTemplate));
  } catch (error) {
    next(error);
  }
}

async function addFavorite(req, res, next) {
  try {
    const templateId = parseId(req.params.templateId);
    if (templateId === null) {
      return res.status(400).json({ message: "Invalid template id" });
    }

    const template = await db("templates").where({ id: templateId }).first();
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    const existingFavorite = await db("favorites")
      .where({ user_id: req.user.id, template_id: templateId })
      .first();
    if (existingFavorite) {
      return res.status(409).json({ message: "Template is already in your favorites" });
    }

    await db("favorites").insert({ user_id: req.user.id, template_id: templateId });

    res.status(201).json({ message: "Template added to favorites" });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({ message: "Template is already in your favorites" });
    }
    next(error);
  }
}

async function removeFavorite(req, res, next) {
  try {
    const templateId = parseId(req.params.templateId);
    if (templateId === null) {
      return res.status(400).json({ message: "Invalid template id" });
    }

    const deletedCount = await db("favorites")
      .where({ user_id: req.user.id, template_id: templateId })
      .del();

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Template is not in your favorites" });
    }

    res.json({ message: "Template removed from favorites" });
  } catch (error) {
    next(error);
  }
}

module.exports = { getFavorites, addFavorite, removeFavorite };
