// server/middleware/authMiddleware.js
import createAuth, { getAuthInstance } from "../auth.js";

export const requireAuth = async (req, res, next) => {
  try {
    // Better Auth reads the session directly from incoming Express cookies/headers
    let session = req.session;

    if (!session) {
      const session = await getAuthInstance().api.getSession({
        headers: req.headers,
      });
      req.session = session;
    }

    if (!session) {
      return res.status(401).json({ error: "Unauthorized: Please log in." });
    }

    if (session.user.isAnonymous) {
      return res.status(403).json({
        error: "Forbidden: Anonymous users cannot access this resource.",
      });
    }

    // Attach user data directly to the request object for use in your controllers
    req.user = session.user;
    req.sessionInfo = session.session;

    next(); // User is authenticated, proceed to the route handler
  } catch (error) {
    return res.status(500).json({ error: "Internal Auth Error" });
  }
};

export const passUserAuth = async (req, res, next) => {
  try {
    const session = await getAuthInstance().api.getSession({
      headers: req.headers,
    });

    if (session) {
      req.user = session.user;
      req.session = session;
    }

    next(); // Proceed regardless of authentication status
  } catch (error) {
    return res.status(500).json({ error: "Internal Auth Error" });
  }
};

// requireSession
export const requireSession = async (req, res, next) => {
  try {
    const session = await getAuthInstance().api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Please log in or continue as guest" });
    }

    req.user = session.user;
    req.sessionInfo = session.session;

    next(); // User is authenticated, proceed to the route handler
  } catch (error) {
    return res.status(500).json({ error: "Internal Auth Error" });
  }
};
