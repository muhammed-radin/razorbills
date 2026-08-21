// server/auth.js
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import { admin } from "better-auth/plugins";
import { generateBetterAuthFields } from "./schemaMapper.js";

export const auth = betterAuth({
  database: mongodbAdapter(
    // Extract the raw MongoClient from your Mongoose connection pool
    mongoose.connection.getClient(),
  ),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [admin()],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: (profile, context) => {
        console.log("Google profile:");
        console.log(profile);
        console.log("Google context:");
        console.log(context);

        return {
          // Email and Name remain unencrypted for authentication lookups
          email: profile.email,
          name: profile.name,

          // Pull the custom encrypted strings sent from your Vite frontend form
          ...context?.data,
          ...profile,
        };
      },
    },
  },
  user: generateBetterAuthFields(),

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
