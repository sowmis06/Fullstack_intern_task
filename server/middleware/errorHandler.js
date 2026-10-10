function notFound(req, res) {
  res.status(404).json({ message: "Route not found" });
}

function errorHandler(error, req, res, next) {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Request body is not valid JSON" });
  }

  console.error(error);
  res.status(500).json({ message: "Something went wrong on the server" });
}

module.exports = { notFound, errorHandler };
