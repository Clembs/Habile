import { GuildMember } from 'discord.js';
import { db } from '.';
import { users } from './schema';
import { eq } from 'drizzle-orm';

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

export async function addMemberToParty(member: GuildMember, partyId: string) {
  await db
    .insert(users)
    .values({
      id: member.user.id,
      partyId: partyId,
    })
    .onConflictDoUpdate({
      set: {
        partyId: partyId,
      },
      target: [users.id],
      targetWhere: eq(users.id, member.user.id),
    });

  const partyRole = member.guild.roles.cache.find(({ name }) => name === partyId);

  member.roles.add(partyRole);
}

export async function removeMemberFromParty(member: GuildMember, partyId: string) {
  await db
    .update(users)
    .set({
      partyId: null,
    })
    .where(eq(users.id, member.user.id));

  const partyRole = member.guild.roles.cache.find(({ name }) => name === partyId);

  member.roles.remove(partyRole);
}
