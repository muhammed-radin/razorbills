import express from "express";
import { checkDatabaseConnection } from "../utils/db.js";
import { getAgenda } from "../utils/agenda.js";
import { createExpressMiddleware } from "agendash";
import { requireAdmin, requirePermission } from "../utils/middlewares/RBAC.js";
import { requireAuth } from "../utils/middlewares/reqiuredAuth.js";

const router = express.Router();

router.use(
  "/dashboard",
  checkDatabaseConnection,
  requireAuth,
  requireAdmin,
  requirePermission("read"),
  async (req, res, next) => {
    const { agenda } = await getAgenda();
    const controller = createExpressMiddleware(agenda);
    controller(req, res, next);
  },
);

router.get(
  "/stop",
  checkDatabaseConnection,
  requireAuth,
  requireAdmin,
  requirePermission("write"),
  async (req, res) => {
    const { agenda } = await getAgenda();
    await agenda.stop();
    res.send("Agenda jobs stopped.");
  },
);

export default router;
