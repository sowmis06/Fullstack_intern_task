require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const templateRoutes = require("./routes/templateRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Copy .env.example to .env and set it.");
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/favorites", favoriteRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
