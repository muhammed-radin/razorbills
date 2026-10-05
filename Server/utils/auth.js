// server/auth.js
import { APIError, betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, anonymous } from "better-auth/plugins";
import { UserModel } from "../models/schema/user.js";
import { createAuthMiddleware } from "better-auth/api";
import { decryptStrict } from "./crypt.js";
import mongoose, { Mongoose } from "mongoose";
import {
  ErrorEvent,
  evt,
  Evts,
  SessionEvent,
  UserEvent,
} from "./events.manage.js";
import { id } from "zod/v4/locales";

let authInstance = null;

export default function createAuth(db) {
  if (authInstance) {
    return authInstance;
  }

  authInstance = betterAuth({
    database: mongodbAdapter(
      // Extract the raw MongoClient from your Mongoose connection pool
      db,
    ),
    onAPIError: {
      onError: async (error, context) => {
        evt.fire(
          Evts.ERROR,
          new ErrorEvent({
            type: Evts.ERROR,
            error: error.message || "Unknown error",
            errorCode: error.code || 500,
            data: error,
          }),
        );
      },
    },
    databaseHooks: {
      user: {
        create: {
          after: async (userData, context) => {
            const resolvedUserId = userData.id || userData._id?.toString();

            if (!resolvedUserId) {
              throw new Error("User ID not found");
            }

            const normalizedUserData = {
              ...userData,
              id: resolvedUserId,
            };

            const createdUser = await UserModel.create({
              id: resolvedUserId,
              email: userData.email,
              emailVerified: userData.emailVerified,
              name: userData.name,
              image: userData.image,
              role: "user",
              adminPermissions: [],
              isActive: true,
            });

            // Trigger event after user creation
            evt.fire(
              Evts.USER_REGISTERED,
              new UserEvent({
                type: Evts.USER_REGISTERED,
                user: userData,
                isGuest: userData?.isAnonymous || false,
                userId: resolvedUserId,
              }),
            );

            return { data: userData };
          },
        },
        delete: {
          after: async (userData, context) => {
            await UserModel.deleteOne({ id: userData.id });
            evt.fire(
              Evts.USER_DELETED,
              new UserEvent({
                type: Evts.USER_DELETED,
                user: userData,
                isGuest: userData?.isAnonymous || false,
                userId: userData.id,
              }),
            );
          },
        },
        update: {
          after: async (userData, context) => {
            await UserModel.updateOne({ id: userData.id }, userData);
            evt.fire(
              Evts.USER_PROFILE_UPDATED,
              new UserEvent({
                type: Evts.USER_PROFILE_UPDATED,
                user: userData,
                isGuest: userData?.isAnonymous || false,
                userId: userData.id,
              }),
            );
          },
        },
      },
      session: {
        create: {
          after: async (sessionData, context) => {
            evt.fire(
              Evts.USER_LOGGED_IN,
              new SessionEvent({
                type: Evts.USER_LOGGED_IN,
                session: sessionData,
              }),
            );
            evt.fire(
              Evts.SITE_VIEWED,
              new SessionEvent({
                type: Evts.SITE_VIEWED,
                session: sessionData,
              }),
            );
          },
        },
        delete: {
          after: async (sessionData, context) => {
            evt.fire(
              Evts.USER_LOGGED_OUT,
              new SessionEvent({
                type: Evts.USER_LOGGED_OUT,
                session: sessionData,
              }),
            );
          },
        },
        update: {
          after: async (sessionData, context) => {
            evt.fire(
              Evts.USER_LOGGED_IN,
              new SessionEvent({
                type: Evts.USER_LOGGED_IN,
                session: sessionData,
              }),
            );
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
              evt.fire(
                Evts.ERROR,
                new ErrorEvent({
                  type: Evts.ERROR,
                  error: "Password decryption failed",
                  errorCode: 400,
                  data: { path: ctx.path },
                }),
              );
              throw new Error("Password decryption failed");
            }
          }
        }
      }),
      after: createAuthMiddleware(async (ctx) => {
        if (ctx.path === "/sign-out") {
          evt.fire(
            Evts.USER_LOGGED_OUT_REQUEST,
            new UserEvent({
              type: Evts.USER_LOGGED_OUT_REQUEST,
              user:
                ctx?.user || ctx.session?.user || ctx.newSession?.user || null,
              isGuest:
                ctx?.user?.isAnonymous ||
                ctx.session?.user?.isAnonymous ||
                ctx.newSession?.user?.isAnonymous ||
                false,
              userId:
                ctx?.user?.id ||
                ctx.session?.user?.id ||
                ctx.newSession?.user?.id ||
                null,
            }),
          );
        } else if (ctx.path === "/reset-password") {
          evt.fire(
            Evts.USER_PASSWORD_CHANGED,
            new UserEvent({
              type: Evts.USER_PASSWORD_CHANGED,
              user:
                ctx?.user || ctx.session?.user || ctx.newSession?.user || null,
              isGuest:
                ctx?.user?.isAnonymous ||
                ctx.session?.user?.isAnonymous ||
                false,
              userId:
                ctx?.user?.id ||
                ctx.session?.user?.id ||
                ctx.newSession?.user?.id ||
                null,
            }),
          );
        } else if (ctx.path === "/update-password") {
          evt.fire(
            Evts.USER_PASSWORD_CHANGED,
            new UserEvent({
              type: Evts.USER_PASSWORD_CHANGED,
              user:
                ctx?.user || ctx.session?.user || ctx.newSession?.user || null,
              isGuest:
                ctx?.user?.isAnonymous ||
                ctx.session?.user?.isAnonymous ||
                false,
              userId:
                ctx?.user?.id ||
                ctx.session?.user?.id ||
                ctx.newSession?.user?.id ||
                null,
            }),
          );
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
          "User already exists. Please log-in instead.",
          {
            status: 400,
          },
          400,
        );
      },
      minPasswordLength: 8,
    },
    plugins: [
      anonymous({
        emailDomainName: "guest.razorbills.app",
        generateName: (user) => `Guest-${Math.floor(Math.random() * 100000)}`,
      }),
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
          required: true,
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
        generateId: () => {
          return new mongoose.Types.ObjectId().toString();
        }, // Set "false" to use MongoDB's default ObjectId, or "uuid" to use UUIDs
      },
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
      },
    },
    trustedOrigins: [process.env.FRONTEND_URL],
    baseURL: process.env.BETTER_AUTH_URL,
    secret: process.env.BETTER_AUTH_SECRET,
  });

  return authInstance;
}

export function getAuthInstance() {
  return createAuth(mongoose.connection);
}
