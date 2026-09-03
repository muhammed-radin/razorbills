// server/middleware/rbacMiddleware.js
import createAuth from "../auth.js";

// Middleware A: Protect Custom User Data Routes (Users access ONLY their own data)
export const requireAdmin = async (req, res, next) => {
  const session = await createAuth().api.getSession({ headers: req.headers });
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const isStaff =
    session.user.role === "admin" || session.user.role === "owner";
  const isOwnerOfData = session.user.id === req.params.userId;

  if (!isStaff && !isOwnerOfData) {
    return res
      .status(403)
      .json({ error: "Access Denied: You can only access your own data." });
  }

  req.user = session.user;
  next();
};

// Middleware B: Protect Admin Actions with specific granular capability flags
export const requirePermission = (requiredCapability) => {
  return async (req, res, next) => {
    const session = await createAuth().api.getSession({ headers: req.headers });
    if (!session) return res.status(401).json({ error: "Unauthorized" });

    if (session.user.role === "owner") {
      req.user = session.user;
      return next();
    }

    if (session.user.role !== "admin") {
      return res
        .status(403)
        .json({ error: "Forbidden: Admin access required." });
    }

    // 🎯 CODE SIMPLIFICATION: Directly check the array passed by Better Auth
    // session.user.adminPermissions looks like: ["read", "write"]
    const permissions = session.user.adminPermissions || [];

    if (!permissions.includes(requiredCapability)) {
      return res.status(403).json({
        error: `Forbidden: Missing required permission: ${requiredCapability}`,
      });
    }

    req.user = session.user;
    next();
  };
};
