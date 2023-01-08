import emojis from './emojis';

export const roles = {
  colors: {
    label: 'Color',
    title: 'Customize name color',
    description:
      "Using the dropdown menu below, you can change your server nickname's color to whatever you like! This will be reflected in messages, the members list, and in many other places within the server.",
    emoji: '🎨',
    roles: [
      ['Crimson', '967853831159435354', 'FF2525'],
      ['Orange Peel', '967853915716603954', 'FF9100'],
      ['Lemon', '967854014001717248', 'DDC61D'],
      ['Grass', '967854051654000690', '32CC32'],
      ['Jade', '967856055939911681', '00A86B'],
      ['Sky', '967856538498773052', '95B0CE'],
      ['Azure', '984522178391339138', '2C91FF'],
      ['Navy', '967856777939001344', '000080'],
      ['Purplue', '925392156166856734', '987FFF'],
      ['Electric Purple', '967857696026030110', 'BC4BFF'],
      ['Cherry Blossom', '967858274928054322', 'FF92A6'],
    ].map(([name, id, color]) => ({
      name,
      id,
      description: '',
      emoji: emojis.colors?.[name.toLowerCase().replace(' ', '_')],
      color: parseInt(color, 16),
    })),
  },
  notifications: {
    label: 'Notifications',
    title: 'Notification roles',
    description:
      "I do a variety of things, and you may not care about all of it, or forget some events or streams I host. So, get pinged for stuff **you** care about, because @everyone pings are overrated. (you'll still get them when something REALLY cool and worth the ping is on the horizon, tho).",
    emoji: '🔔',
    roles: [
      {
        id: '1013041376092495942',
        name: 'New Content',
        description: 'New and original Clembs creations.',
        emoji: '🆕',
      },
      {
        id: '1013041603427966996',
        name: 'Updates & Events',
        description: 'When a new event is scheduled or major updates happen.',
        emoji: '🔔',
      },
      {
        id: '1013041680439582801',
        name: 'Streams',
        description: 'Know when I stream out of schedule.',
        emoji: '📺',
      },
    ],
  },
  // access: {
  //   label: 'More',
  //   title: 'Access more channels',
  //   description:
  //     "The server at its core is aiming for minimalism, which is why you don't see a lot of the hidden channels. Below is some roles to expand what you have access to.\nSome other channels are still kept private and require manual verification, like the #borderline channel.",
  //   emoji: '🔓',
  //   roles: [
  //     {
  //       id: '1021801774757195808',
  //       name: 'Clembs SMP Early Access',
  //       description: 'Enter the Clembs SMP Minecraft server, next holiday!',
  //       emoji: '⛏️',
  //     },
  //     {
  //       id: '1023546680454430721',
  //       name: 'Join the Hydranation SMP clan! #ad',
  //       description: 'We descend from newts to revive our glory on this world!',
  //       // emoji: emojis.colors.azure,
  //     },
  //   ],
  // },
};
