import { test as base, expect, request as pwRequest } from "@playwright/test";

export const test = base;
export { expect };

export const API = "http://localhost:3000";

/** Fresh API context (no cookies) for negative/security tests. */
export async function apiContext() {
  return pwRequest.newContext({ baseURL: API });
}

export function rand(suffix = "") {
  return `pw${Date.now().toString(36)}${suffix}`;
}

/** Promote/demote/delete test users directly in the DB. */
export async function dbHelper(action, email) {
  const { execFile } = await import("node:child_process");
  const { readFileSync } = await import("node:fs");
  // Load Server/.env (MONGODB_URI lives there, not in the test env).
  const env = { ...process.env };
  try {
    for (const line of readFileSync("Server/.env", "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m && env[m[1]] === undefined) {
        env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // fall through; mongoose will report a missing URI
  }
  const script = `
    const mongoose = (await import("mongoose")).default;
    (async () => {
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 20000 });
      const db = mongoose.connection.db;
      const email = ${JSON.stringify(email)};
      if (${JSON.stringify(action)} === "promote") {
        // Role lives in TWO collections: the app users doc (used by
        // requireAdmin fallbacks/listing) and the better-auth identity
        // (source of session.user.role). Both must agree.
        await db.collection("users").updateOne({ email }, { $set: { role: "admin", adminPermissions: ["read", "create", "update", "delete", "write"] } });
        await db.collection("users_validation").updateOne({ email }, { $set: { role: "admin", adminPermissions: ["read", "create", "update", "delete", "write"] } });
        console.log("PROMOTED", email);
      } else if (${JSON.stringify(action)} === "demote") {
        await db.collection("users").updateOne({ email }, { $set: { role: "user", adminPermissions: [] } });
        await db.collection("users_validation").updateOne({ email }, { $set: { role: "user", adminPermissions: [] } });
        console.log("DEMOTED", email);
      } else if (${JSON.stringify(action)} === "cleanup") {
        const u = await db.collection("users").findOne({ email });
        if (u) {
          await db.collection("users").deleteOne({ email });
          await db.collection("users_validation").deleteMany({ email });
          await db.collection("carts").deleteMany({ userId: u.id });
          await db.collection("orders").deleteMany({ userId: u.id, id: /^ORD-.*-PWTEST/ });
          console.log("CLEANED", email);
        } else console.log("ABSENT", email);
      }
      await mongoose.disconnect();
    })().catch((e) => { console.error("DBHELPER_FAIL", e.message); process.exit(1); });
  `;
  return new Promise((resolve, reject) => {
    execFile(
      "node",
      ["-e", script],
      { cwd: "Server", env },
      (err, stdout, stderr) => {
        if (err) return reject(new Error(stdout + stderr));
        resolve(stdout.trim());
      },
    );
  });
}
