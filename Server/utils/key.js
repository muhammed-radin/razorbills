// validate keys with env vars
export function validateApiKeys(req, res, next) {
  if (process.env.NODE_ENV === "development") {
    next();
    return 0;
  }

  if (req.headers["server-api-key"] === process.env.SERVER_API_KEY) {
    if (req.headers["actions-api-key"] === process.env.ACTION_ACCESS_TOKEN) {
      next();
    } else {
      console.log("Invalid Actions API Key");
      console.log("Expected:", process.env.ACTION_ACCESS_TOKEN);
      console.log("Received:", req.headers["actions-api-key"]);
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

export default { validateApiKeys };
