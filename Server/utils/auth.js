// server/auth.js
import { APIError, betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin } from "better-auth/plugins";
import { db } from "./db.js";
import { UserModel } from "../models/schema/user.js";
import { createAuthMiddleware } from "better-auth/api";
import { decryptStrict } from "./crypt.js";

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
        },
      },
      delete: {
        after: async (userData, context) => {
          await UserModel.deleteOne({ id: userData.id });
        },
      },
      update: {
        after: async (userData, context) => {
          await UserModel.updateOne({ id: userData.id }, userData);
        },
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // 1. Target email sign-in and sign-up endpoints
      if (ctx.path === "/sign-in/email" || ctx.path === "/sign-up/email") {
        if (ctx.body && typeof ctx.body.password === "string") {
          try {
            // 2. Decrypt client-encrypted password back to plain text
            const plainPassword = decryptStrict(ctx.body.password);

            // 3. Mutate request body before Better Auth validates or hashes
            ctx.body.password = plainPassword;
          } catch (error) {
            throw new Error("Password decryption failed");
          }
        }
      }
    }),
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    onExistingUserSignUp: async ({ user }, req) => {
      // Custom logic for handling existing users during sign-up
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
  account: {
    accountLinking: {
      updateUserInfoOnLink: true, // Update user info when linking accounts
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: ["openid", "email", "profile"],
      prompt: "select_account consent",

      mapProfileToUser: async (profile) => {
        // Guarantee a non-empty name string to satisfy DB validation
        const nameFallback =
          profile.name ||
          `${profile.given_name || ""} ${profile.family_name || ""}`.trim() ||
          profile.email.split("@")[0];

        const profilePicture =
          profile.picture ||
          "https://api.dicebear.com/10.x/glyphs/svg?borderRadius=45&seed=" +
            encodeURIComponent(nameFallback);

        return {
          email: profile.email,
          emailVerified: profile.email_verified,
          name: nameFallback,
          image: profilePicture,
          role: "user",
        };
      },
    },
  },
  user: {
    modelName: "users_validation", // Ensure this matches your Mongoose model name
    additionalFields: {
      profilePicture: {
        type: String,
        default: "",
        required: false,
        input: true,
        returned: true,
      },
      adminPermissions: {
        type: [String],
        default: [],
        required: false,
        input: false,
        returned: true,
      },
    },
    fields: {
      image: "profilePicture", // Map the "image" field to "profilePicture" in your Mongoose model
    },
  },

  advanced: {
    database: {
      generateId: false, // Use Mongoose's default ObjectId generation
    },
  },
  trustedOrigins: [process.env.FRONTEND_URL || "http://localhost:5173"],
});
