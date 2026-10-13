import { db } from "./db.js";

async function deleteUserById(userId) {
  await db.collection("session").deleteMany({ userId: userId });
  await db.collection("account").deleteMany({ userId: userId });
  await db.collection("users_validation").deleteOne({ id: userId });
  await db.collection("users").deleteOne({ id: userId });
}

async function migrateOldUserToNewUser(
  oldUser,
  newUser,
  isSignupMigration = true, // this means if true guest user -> new registered user ( signup migration ), else guest user -> already registered user ( login migration )
  debbug = true,
) {
  // In the migration we want to do these things:
  // 1. Update the new user with the old user's data. if isSignupMigration is false
  // if isSignupMigration is true, uses new user's data and forget old user's data. migrates only analyitcs and preserve old user ID only
  // 2. Delete the old user from the auth system
  // 3. Ensure and Add better auth additional data to the new user if needed (like emailVerified, banned, profilePicture, etc.)
  // 4. change all CounterModel's old user id to new user id
  // 5. change all InteractionModel's old user id to new user id
  // NOTE: Analytics past site data never migrates, we change all userIDs of ( CounterModel, InteractionModel) to new user id, this prevents duplicate analytics data. We keep the old user ID in the analytics data for historical purposes.
  // 7. preserve the old user ID in the analytics data for historical purposes.
  // 8. clones user interactions ( isLiked, isViewed, ...etc ) and counters to the new user ID, then delete the old user
  // -----------------------------
  // Steps:
  // Extract both user IDs.
  const oldUserId = oldUser.id || oldUser.userId || oldUser._id;
  const newUserId = newUser.id || newUser.userId || newUser._id;

  // migrate basic user data
  let setData = {};
  let basicBetterAuthData = {
    adminPermissions: newUser.adminPermissions || [],
    emailVerified: newUser.emailVerified || false,
    banned: newUser.banned || false,
    profilePicture: newUser.profilePicture || null,
    providedBy: newUser.providedBy || "local",
    updatedAt: newUser.updatedAt || new Date(),
    preservedOldUserId: oldUserId, // preserve the old user ID for historical purposes
  };
  if (isSignupMigration) {
    // if it's a signup migration
    setData = {
      ...basicBetterAuthData,
    };
  } else {
    // if it's a login migration
    setData = {
      ...basicBetterAuthData,
    };
  }

  await db
    .collection("users_validation")
    .updateOne({ id: newUserId }, { $set: setData }, { upsert: false });
  if (debbug) console.log("migrateOldUserToNewUser: setData", setData);
  if (debbug) console.log("users_validation updated for newUserId:", newUserId);

  await db
    .collection("users")
    .updateOne({ id: newUserId }, { $set: setData }, { upsert: false });
  if (debbug) console.log("users updated for newUserId:", newUserId);

  // delete the old user ( Safe Level )
  await deleteUserById(oldUserId);
  if (debbug) console.log("Old user deleted:", oldUserId);

  // Update all CounterModel's old user id to new user id
  await db.collection("counters").updateMany(
    { userId: oldUserId },
    {
      $set: {
        // If refId matches oldUserId, set refId to newUserId, otherwise keep its existing value
        refId: {
          $cond: {
            if: { $eq: ["$refId", oldUserId] },
            then: newUserId,
            else: "$refId",
          },
        },
        // Always update userId to newUserId
        userId: newUserId,
      },
    },
  );
  if (debbug) console.log("counters updated for newUserId:", newUserId);

  // Update all InteractionModel's old user id to new user id
  if (isSignupMigration) {
    await db
      .collection("interactions")
      .updateMany(
        { userId: oldUserId },
        { $set: { userId: newUserId, isGuest: false } },
      );
    if (debbug)
      console.log("--SIGNUP: interactions updated for newUserId:", newUserId);
  } else {
    // clone content of old user to already exiting user
    await db.collection("interactions").updateMany(
      { userId: newUserId },
      {
        $set: {
          // hasViewed, hasShared, isGuest
          hasViewed: {
            $cond: {
              if: { $eq: ["$hasViewed", true] },
              then: true,
              else: "$hasViewed",
            },
          },
          hasShared: {
            $cond: {
              if: { $eq: ["$hasShared", true] },
              then: true,
              else: "$hasShared",
            },
          },
          isGuest: false,
          updatedAt: new Date(), // Update the timestamp to reflect the merge
          // other actions blocked for guest users.
        },
      },
    );
    if (debbug)
      console.log("--LOGIN: interactions updated for newUserId:", newUserId);
  }
}

export { deleteUserById, migrateOldUserToNewUser };
