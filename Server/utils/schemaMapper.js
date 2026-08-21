// server/utils/schemaMapper.js
import { UserSchema } from "../models/schema/user.js";

export function generateBetterAuthFields() {
  const additionalFields = {};

  // Core identity keys completely managed by Better Auth's internal router
  const nativeFields = [
    "_id",
    "id",
    "name",
    "email",
    "emailVerified",
    "image",
    "profilePicture",
    "role",
    "createdAt",
    "updatedAt",
    "__v",
  ];

  // Fields that standard users must NEVER overwrite via client payloads
  const serverOwnedFields = [
    "isActive",
    "adminPermissions",
    "totalSpent",
    "AOV",
  ];

  Object.keys(UserSchema.paths).forEach((fieldName) => {
    // Skip native framework fields
    if (nativeFields.includes(fieldName)) return;

    const mongooseField = UserSchema.paths[fieldName];
    let fieldType = null;

    // 🎯 1. Map String Arrays natively supported by Better Auth
    if (
      mongooseField.instance === "Array" &&
      mongooseField.caster?.instance === "String"
    ) {
      fieldType = "string[]";
    }
    // 🎯 2. Map standard primitive types
    else if (mongooseField.instance === "String") fieldType = "string";
    else if (mongooseField.instance === "Number") fieldType = "number";
    else if (mongooseField.instance === "Boolean") fieldType = "boolean";
    else if (mongooseField.instance === "Date") fieldType = "date";

    // 🛡️ 3. SAFE SKIP RULE: If it's a nested object (SingleNested/Mixed), skip it!
    // Better Auth won't track it, and Mongoose handles it purely via custom routes.
    if (!fieldType) return;

    // 🔒 4. Build configuration block dynamically
    additionalFields[fieldName] = {
      type: fieldType,
      returned: true, // Passes field state down to useSession() on React client
      input: !serverOwnedFields.includes(fieldName), // 👈 Automatically enforces security boundaries
    };
  });

  return additionalFields;
}
