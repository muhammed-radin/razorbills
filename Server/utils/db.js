import mongoose from "mongoose";
import { dbEventNames, dbEvents } from "./events.manage.js";
const max_tries = 5;
let tries = 0;

function connectToDatabase() {
  dbEvents.fire(dbEventNames.CONNECTING, tries);
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(async () => {
        dbEvents.fire(dbEventNames.CONNECTED);
        console.log("Connected!");
        resolve();
        // Get the database instance
        const db = mongoose.connection.db;
      })
      .catch((err) => {
        dbEvents.fire(dbEventNames.ERROR, err);
        console.log("Error connecting to MongoDB");
        console.error("Connection error:", err);
        console.log("Retrying in 5 seconds....  (Tries: " + tries + ").");
        setTimeout(() => {
          connectToDatabase().then(resolve);
        }, 5000); // Retry after 5 seconds
        tries++;
        if (tries >= max_tries) {
          dbEvents.fire(
            dbEventNames.ERROR,
            new Error("Max retries reached. Exiting..."),
          );
          console.log("Max retries reached. Exiting...");
          process.exit(1); // Exit with an error code
        }
      });
  });
}

async function dropDatabase() {
  try {
    // Accesses the underlying MongoDB driver directly
    await mongoose.connection.db.dropDatabase();
    console.log("Database entirely deleted.");
  } catch (error) {
    console.error("Failed to drop database:", error);
  }
}

async function dropCollectionByName(name) {
  try {
    await mongoose.connection.db.dropCollection(name);
    console.log(`Collection "${name}" dropped.`);
  } catch (error) {
    console.error(`Failed to drop collection:`, error);
  }
}

async function startDB(req, res, next) {
  if (mongoose.connection.readyState == 1) {
    next();
  } else if (mongoose.connection.readyState == 0) {
    await connectToDatabase();
    next();
  }
}

function checkDatabaseConnection(req, res, next) {
  if (mongoose.connection.readyState == 1) {
    next();
  } else if (mongoose.connection.readyState == 0) {
    return res
      .status(503)
      .json({ message: "Database connection not established" });
  } else if (mongoose.connection.readyState == 2) {
    return res
      .status(503)
      .json({ message: "Database connection is currently connecting" });
  } else if (mongoose.connection.readyState == 3) {
    return res
      .status(503)
      .json({ message: "Database connection is currently disconnecting" });
  } else if (mongoose.connection.readyState == 99) {
    return res.status(503).json({ message: "Database connection is closed" });
  }
}

// export db
const db = mongoose.connection;
export {
  db,
  connectToDatabase,
  dropDatabase,
  dropCollectionByName,
  checkDatabaseConnection,
  startDB,
};
