import mongoose from "mongoose";
const max_tries = 5;
let tries = 0;

function connectToDatabase() {
  return new Promise((resolve, reject) => {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(async () => {
        console.log("Connected!");
        resolve();
        // Get the database instance
        const db = mongoose.connection.db;
      })
      .catch((err) => {
        console.log("Error connecting to MongoDB");
        console.error("Connection error:", err);
        console.log("Retrying in 5 seconds....  (Tries: " + tries + ").");
        setTimeout(() => {
          connectToDatabase().then(resolve);
        }, 5000); // Retry after 5 seconds
        tries++;
        if (tries >= max_tries) {
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

// export db
const db = mongoose.connection;
export { db, connectToDatabase, dropDatabase, dropCollectionByName };
