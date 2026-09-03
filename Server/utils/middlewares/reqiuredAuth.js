// server/middleware/authMiddleware.js
import createAuth from "../auth.js";

export const requireAuth = async (req, res, next) => {
  try {
    // Better Auth reads the session directly from incoming Express cookies/headers
    const session = await createAuth().api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return res.status(401).json({ error: "Unauthorized: Please log in." });
    }

    // Attach user data directly to the request object for use in your controllers
    req.user = session.user;
    req.sessionInfo = session.session;

    next(); // User is authenticated, proceed to the route handler
  } catch (error) {
    return res.status(500).json({ error: "Internal Auth Error" });
  }
};
