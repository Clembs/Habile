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
      name: 'Creative Awards rules',
      emoji: '⛄',
      value: dedent`
      • You can vote for as many of your favorite posts by ❤️-reacting to them.
      • A creator may upload multiple entries.
      • Voting for your own post will not affect the score and be subtracted when making the results.
`,
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
      name: 'Clembs SMP rules',
      emoji: '⛏️',
      value: `You may find the Clembs SMP rules by going to <#${channels.smp_about}>, granted you have access to the channel.`,
    },
  ],
  smp: {
    guide: {
      title: 'Clembs SMP - Getting started',
      steps: [
        [
          'Install Minecraft Java 1.19.2 or above',
          'Cracks are supported, but consider buying the game if you can :P\n[OptiFine]({optifine}) or [Sodium]({sodium}) recommended!',
        ],
        [
          'Join the `smp.clembs.com` server',
          'Only registered players can join! Check with the "Members list" button below.',
        ],
        [
          'Sign in!',
          'To prevent cracked account abuse, you will be required to create and use a password when entering.',
        ],
        [
          'Join a team, or create one!',
          "Completely optional, but you're welcome to join or create teams!",
        ],
      ],
    },
  },
};
