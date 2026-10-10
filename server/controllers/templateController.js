const db = require("../config/db");
const { parseId, formatTemplate } = require("../utils/helpers");

  async function getTemplates(req, res, next) {
  try {
    const { search, category } = req.query;
    const query = db("templates").orderBy("id");

    if (typeof category === "string" && category !== "" && category !== "All") {
      query.where({ category });
    }

    if (typeof search === "string" && search.trim() !== "") {
      const pattern = `%${search.trim()}%`;
      query.where((builder) => {
        builder.where("name", "like", pattern).orWhere("description", "like", pattern);
      });
    }

    const rows = await query;
    res.json(rows.map(formatTemplate));
  } catch (error) {
    next(error);
  }
}

async function getTemplateById(req, res, next) {
  try {
    const templateId = parseId(req.params.id);
    if (templateId === null) {
      return res.status(400).json({ message: "Invalid template id" });
    }

    const template = await db("templates").where({ id: templateId }).first();
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    res.json(formatTemplate(template));
  } catch (error) {
    next(error);
  }
}

module.exports = { getTemplates, getTemplateById };
