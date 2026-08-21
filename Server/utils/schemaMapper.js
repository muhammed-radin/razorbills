// server/utils/schemaMapper.js
import { UserSchema } from "../models/schema/user.js";

export function generateBetterAuthFields() {
  const additionalFields = {};

  // Core fields managed natively by Better Auth that we must ignore in our loop
  const nativeFields = [
    "_id",
    "id",
    "name",
    "email",
    "emailVerified",
    "image",
    "createdAt",
    "updatedAt",
    "__v",
  ];

  // Loop through every path present in your Mongoose definition
  Object.keys(UserSchema.paths).forEach((fieldName) => {
    if (!nativeFields.includes(fieldName)) {
      const mongooseField = UserSchema.paths[fieldName];

      // Map standard Mongoose object instances to standard Better Auth primitive strings
      let fieldType = "string";
      if (mongooseField.instance === "Number") fieldType = "number";
      if (mongooseField.instance === "Boolean") fieldType = "boolean";

      additionalFields[fieldName] = {
        type: fieldType,
        required: mongooseField.isRequired || false,
        returned: true, // Ensures it passes gracefully down to useSession() on React
        input: true,
      };
    }
  });

  return additionalFields;
}
