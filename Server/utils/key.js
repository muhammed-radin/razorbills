// validate keys with env vars
function validateApiKeys(req, res, next) {
  if (req.headers["server-api-key"] === process.env.SERVER_API_KEY) {
    if (req.headers["actions-api-key"] === process.env.ACTION_ACCESS_TOKEN) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden: Invalid Actions API Key" });
      res.end();
      return;
    }
  } else {
    res.status(403).json({ message: "Forbidden: Invalid API Key" });
    res.end();
    return;
  }
}

module.exports = { validateApiKeys };
