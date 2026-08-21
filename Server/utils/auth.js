// server/auth.js
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";

export const auth = betterAuth({
  database: mongodbAdapter(
    // Extract the raw MongoClient from your Mongoose connection pool
    mongoose.connection.getClient(),
  ),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      // ⚠️ CRITICAL: Disable Better Auth's internal text string ID generation.
      // This forces Better Auth to let MongoDB handle native ObjectIds,
      // ensuring seamless compatibility if your own Mongoose schemas reference users.
      generateId: false,
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],
});
