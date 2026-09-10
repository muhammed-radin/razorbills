import express from "express";
import { checkDatabaseConnection } from "../utils/db.js";
import { getAgenda } from "../utils/agenda.js";
import { createExpressMiddleware } from "agendash";

const router = express.Router();

router.use("/dashboard", checkDatabaseConnection, async (req, res, next) => {
  const agenda = await getAgenda();
  const controller = createExpressMiddleware(agenda);
  controller(req, res, next);
});

router.get("/stop", async (req, res) => {
  const agenda = await getAgenda();
  await agenda.stop();
  res.send("Agenda jobs stopped.");
});

export default router;
