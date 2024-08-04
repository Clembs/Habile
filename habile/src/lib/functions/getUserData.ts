import { db } from '../db';
import { users } from '../db/schema';

export async function getUserData(userId: string): Promise<typeof users.$inferSelect> {
  return {
    id: userId,
    tokensUsed: 0,
    messagesSent: 0,
    knowledge: '',
    dismissedUsageBanner: false,
    lastMessages: [],
    ...(await db.query.users.findFirst({
      where: ({ id }, { eq }) => eq(id, userId),
    })),
  };
}
