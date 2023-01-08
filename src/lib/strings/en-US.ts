import { channels } from '$lib/env';
import dedent from 'dedent';

export default {
  rules: [
    {
      name: 'Be respectful',
      emoji: '🫂',
      value: dedent`Use common sense, constructive criticism, and don't purposefully offend anyone or any group.
      Just like any server, you will need to comply to the **[Discord Terms of Service](https://dis.gd/tos)**.`,
    },
    {
      name: "Things you shouldn't send",
      emoji: '🚫',
      value: dedent`Limit chains, long images, repeatition-based memes to threads.
        Do not share, encourage, discuss piracy, illegal software (hacks, unauthorized client mods) or malware. You've be warned, and are subject to heavier sanctions.`,
    },
    {
      name: 'Keep the server friendly & safe',
      emoji: '☺️',
      value: dedent`Maintain inappropriate jokes/humor, slurs, NSFW topics and everything in-between to a strict minimum. **This server should be friendly to teens 13 and older.**`,
    },
    {
      name: 'Sanctions',
      emoji: '⚠️',
      value:
        'If you accidentally slip, a warn will be added to your Moderation history (</modlogs user:988494582981484585>), nothing more. If you repeatedly break the rules, sanctions can go from a timeout to a permanent ban, depending on your case.',
    },
    {
      name: 'Showcase guidelines',
      emoji: '🖼️',
      value: dedent`
      • Low effort posts may be discussed for removal.
      • Self-made memes belong in <#${channels.memes}>.
      • Use tags appropriately!`,
    },
    {
      name: 'NSFW art guidelines',
      emoji: '🔞',
      value: dedent`Before posting to <#${channels.showcase}> or <#${channels.art}>, make sure your art checks all of these boxes:
      • The creations must not have explicit "hardcore" sexual intent, and the nudity/sexual representations may be purely artistic.
      • The images belonging to the post should be uploaded as spoilers.
      • The post containing the art should clearly denote the sexual character of the creation in its title.`,
    },
    {
      name: 'Borderline rules',
      emoji: '💥',
      value: dedent`
      • Dark, midly offensive or suggestive themes and humor may be tolerated
      • Keep this channel suitable for individuals 16 or older, so no NSFW allowed (NSFW-themes can be allowed depending on what it is. keep common sense in mind.)
      • I do not necessarily approve myself of anything posted by other people.`,
    },
    {
      name: 'Admin & moderator guidelines',
      emoji: '🛠️',
      value: dedent`
      **Activity & Events:**
      • Make sure to keep the server fresh, interesting and active
      • Be active yourself, and create engagement by creating events or sending messages that will create debate, interest or just reactions!
      • Examples of events includes game tournaments, movie nights, on-server minigames (clembs-says, story-event, 2022-goals... just to name a few)
      
      **Adding content:**
      • Feel free to suggest adding content that is wanted or you think is relevant
      • Before adding a channel, make sure that it isn't already in one of the archives, if so bring that back instead
      • If I intentionally removed something, ask me why before bringing it back
      
      **Moderation:**
      • Be friendly to everyone, but don't hesitate on using your powers if something goes out of hand
      • Keep the server on-brand and teen friendly too, so apply to the rules, make people apply to them, avoid drama, insults, mean stuff, etc
      • Whenever possible, use CRBT's moderation commands instead of Discord's built-ins 
      `,
    },
  ],
};
