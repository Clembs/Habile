import { db } from '../db';
import { habileChatData } from '../db/schema';

export async function getGlobalData(): Promise<typeof habileChatData.$inferSelect> {
  return {
    tokens: 0,
    used: 0,
    messages: 0,
    ...(await db.query.habileChatData.findFirst()),
  };
}
