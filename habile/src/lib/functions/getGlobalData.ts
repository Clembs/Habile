import { db } from '../db';

export async function getGlobalData() {
  // group all user data into one object
  const allUserData = await db.query.users.findMany();
  const allUserDataGrouped = allUserData.reduce(
    (acc, curr) => {
      acc.tokensUsed += curr.tokensUsed;
      acc.messagesSent += curr.messagesSent;
      return acc;
    },
    { tokensUsed: 0, messagesSent: 0 },
  );

  return allUserDataGrouped;
}
