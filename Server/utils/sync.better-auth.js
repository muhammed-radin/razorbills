import { getAuthInstance } from "./auth";

export const syncUserDataFromAuth = async (userId) => {
  return new Promise((resolve, reject) => {
    getAuthInstance()
      .api.getUser({
        query: {
          id: userId,
        },
      })
      .then((user) => {
        if (!user) {
          reject(`User with ID ${userId} not found in auth system.`);
          return;
        }

        // Update the user data in your database
        db.collection("users")
          .updateOne(
            { id: userId },
            {
              $set: {
                name: user.name,
                email: user.email,
                role: user.role,
                emailVerified: user.emailVerified,
                banned: user.banned,
                updatedAt: user.updatedAt,
              },
            },
          )
          .then(() => {
            console.log(`User data synced for user ID: ${userId}`);
            resolve();
          })
          .catch((err) => {
            console.error(
              `Error syncing user data for user ID: ${userId}`,
              err,
            );
            reject(err);
          });
      })
      .catch((err) => {
        console.error(
          `Error fetching user from auth for user ID: ${userId}`,
          err,
        );
        reject(err);
      });
  });
};
