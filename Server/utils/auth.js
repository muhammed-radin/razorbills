// server/auth.js
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import { admin } from "better-auth/plugins";
import { generateBetterAuthFields } from "./schemaMapper.js";

export const auth = betterAuth({
  database: mongodbAdapter(
    // Extract the raw MongoClient from your Mongoose connection pool
    mongoose.connection.getClient().db(),
  ),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      adminRoles: ["admin", "owner"],
      defaultRole: "user",
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: (profile, context) => {
        return {
          email: profile.email,
          name: profile.name,
          image: profile.picture, // Using Better Auth's standard native "image" property
          role: "user",

          // Pull raw payload string variables sent during the registration step
          address: context?.data?.address || "",
          phoneNumber: context?.data?.phoneNumber || "",
        };
      },
    },
  },
  user: {
    fields: {
      image: "profilePicture", // Map Better Auth's "image" field to your Mongoose schema's "profilePicture" field
    },
    additionalFields: generateBetterAuthFields(),
    modelName: "users", // Ensure this matches your Mongoose model name
  },

  advanced: {
    database: {
      generateId: false,
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],
});
