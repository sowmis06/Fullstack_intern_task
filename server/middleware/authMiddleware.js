const jwt = require("jsonwebtoken");
const db = require("../config/db");

async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await db("users")
      .select("id", "name", "email")
      .where({ id: payload.id })
      .first();

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = requireAuth;
