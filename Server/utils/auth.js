// server/auth.js
import { APIError, betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import { admin } from "better-auth/plugins";
import { db } from "./db.js";
import { UserModel } from "../models/schema/user.js";

export const auth = betterAuth({
  database: mongodbAdapter(
    // Extract the raw MongoClient from your Mongoose connection pool
    db,
  ),
  databaseHooks: {
    user: {
      create: {
        after: async (userData, context) => {
          userData._id = userData.id; // Ensure _id is set to the same value as id
          const user = await UserModel.create(userData);
          console.log("New user created:", user);
        },
      },
      delete: {
        after: async (userData, context) => {
          await UserModel.deleteOne({ id: userData.id });
          console.log("User deleted:", userData.id);
        },
      },
      update: {
        after: async (userData, context) => {
          await UserModel.updateOne({ id: userData.id }, userData);
          console.log("User updated:", userData.id);
        },
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    onExistingUserSignUp: async ({ user }, req) => {
      // Custom logic for handling existing users during sign-up
      console.log("Existing user attempted to sign up.");
      throw new APIError(
        "BAD_REQUEST",
        "User already exists. Please log in instead.",
        {
          status: 400,
        },
        400,
      );
    },
    minPasswordLength: 8,
  },
  plugins: [
    admin({
      adminRoles: ["admin"],
      defaultRole: "user",
    }),
  ],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      mapProfileToUser: (profile, context) => {
        return {
          ...profile,
          email: profile.email,
          emailVerified: profile.emailVerified,
          name: profile.name,
          image: profile.picture, // Using Better Auth's standard native "image" property
          role: "user",
        };
      },
    },
  },
  user: {
    modelName: "users_validation", // Ensure this matches your Mongoose model name
  },

  advanced: {
    database: {
      generateId: false, // Use Mongoose's default ObjectId generation
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],
});
