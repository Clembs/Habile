export const roles = {
  notifications: {
    title: 'Notification roles',
    description:
      "I do a variety of things, you may not care about all of them, or forget some events or streams I hold. So, get pinged for stuff **you** care about, because @everyone pings are overrated. (you'll still get them when something REALLY cool and worth the ping is on the horizon, tho).",
    emoji: '🔔',
    roles: [
      {
        id: '1013041376092495942',
        name: 'New Content',
        description: 'Brand new content and original creations.',
        emoji: '🆕',
      },
      {
        id: '1013041603427966996',
        name: 'Updates & Events',
        description: 'When a server event is scheduled, or when major updates happen.',
        emoji: '🔔',
      },
      {
        id: '1013041680439582801',
        name: 'Streams',
        description: 'I sometimes stream out of schedule. Select this to know when I do.',
        emoji: '📺',
      },
      // {
      //   id:
      //   '1035582884691595384',
      //   name: 'Creative Awards',
      //   description: ''
      // }
    ],
  },
  colors: {
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
      emoji: '',
      color: parseInt(color, 16),
    })),
  },
  access: {
    title: 'Access more channels',
    description:
      "The server at its core is aiming for minimalism, which is why you don't see a lot of the hidden channels. Below is some roles to expand what you have access to. Some other channels are still kept private and require manual verification, like the #borderline channel.",
    emoji: '🔓',
    roles: [
      {
        id: '1021801774757195808',
        name: 'Minecraft Survival Multiplayer Access',
        description:
          'Grants access to the semi-private Clembs Minecraft server, to launch on the winter holiday!',
        emoji: '⛏️',
      },
    ],
  },
};
