import { db } from '.';

export async function getUser(userId: string) {
  return await db.query.users.findFirst({
    where: ({ id }, { eq }) => eq(id, userId),
    with: {
      party: {
        with: {
          members: true,
          banned: true,
        },
      },
    },
  });
}
