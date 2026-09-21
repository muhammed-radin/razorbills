import { MongoBackend } from "@agendajs/mongo-backend";
import { Agenda } from "agenda";
import mongoose from "mongoose";
import { waitForConnection } from "./db.js";

let agenda = null;

/**
 * Initializes Agenda by linking it to the existing Mongoose connection.
 * This prevents creating unnecessary duplicate connections to MongoDB.
 */
const initAgenda = () => {
  if (agenda) return agenda;

  const connection = mongoose.connection;

  // Ensure Mongoose is connected before initializing Agenda
  if (connection.readyState !== 1) {
    throw new Error("Mongoose must be connected before initializing Agenda.");
  }

  const backend = new MongoBackend({
    mongo: connection.db, // Use the existing Mongoose connection
    collection: "agendaJobs", // Custom collection name for Agenda jobs
  });

  agenda = new Agenda({
    // Pass the existing MongoDB driver instance directly from Mongoose
    backend: backend,
    processEvery: "30 seconds", // How often to scan the DB for due jobs
    maxConcurrency: 20, // Max total jobs running at once per server instance
    defaultConcurrency: 5, // Default max concurrent jobs of a single type
    logging: true, // Enable logging for debugging
  });

  // Handle Agenda internal errors safely
  agenda.on("error", (err) => {
    console.error("❌ Agenda Queue Error:", err);
  });

  return agenda;
};

/**
 * Gracefully shuts down Agenda when the Node process terminates.
 * Prevents jobs from getting stuck in a "locked/running" state indefinitely.
 */
const gracefulShutdown = async () => {
  if (agenda) {
    console.log("\nStopping Agenda gracefully...");
    await agenda.stop();
    console.log("🏁 Agenda stopped successfully.");
    process.exit(0);
  }
};

const useAgenda = () => {
  if (!agenda) return initAgenda();
  return agenda;
};

async function startAssiginTasks(callback) {
  // stop agenda if it's already running
  let isStarted = !!agenda._processInterval;
  if (agenda && isStarted) {
    await agenda.stop();
  }

  callback();

  await agenda.start();
}

const getAgenda = () => {
  return new Promise((resolve, reject) => {
    waitForConnection().then(() => {
      resolve({ agenda: useAgenda(), startAssiginTasks });
    });
  });
};

// Capture system termination signals for clean shutdown
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

export {
  initAgenda,
  // Getter function to fetch the agenda instance anywhere in your app after initialization
  getAgenda,
  gracefulShutdown,
  useAgenda,
  startAssiginTasks,
};
