function keyMiddileWare() {
  return (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (apiKey && apiKey === process.env.API_KEY) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Invalid API Key" });
    }
  };
}

module.exports = keyMiddileWare;
