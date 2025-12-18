const mongoose = require("mongoose");

mongoose
  .connect(
    process.env.MONGODB_URI
  )
  .then(async () => {
    console.log("Connected!");

    // Get the database instance
    const db = mongoose.connection.db;
  })
  .catch((err) => console.error("Connection error:", err));

// export db
module.exports = mongoose.connection;
