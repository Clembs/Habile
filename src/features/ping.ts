import { $slashCommand, InteractionReply } from '$core';
import { colors, emojis } from '$lib/env';
import { createLinkButton, snowflakeToDate } from '@purplet/utils';
import dedent from 'dedent';
import { ComponentType } from 'discord-api-types/v10';
import sendMessage from './send-message';

export default $slashCommand({
  name: 'ping',
  description: '🏓 Pong! Get my response latency & a silly splash text.',
  async handle() {
    const timestamp = snowflakeToDate(this.id);

    const randomPhrases = [
      '**PONG!**',
      '**PANG!**',
      'Right there, ride on!',
      'Habile, always here for you!',
      `${emojis.fish_happy} All systems operational!`,
      `Almost better than CRBT!`,
      'Powered by all of you!',
      'Powering the Clembs community since 2022!',
      '"i couldnt hear your hi\'s, you left me in the lo\'s" - [Trubiso, 2022](https://discord.com/channels/738747595438030888/774555883648057344/994985514207813752)',
      '"can someone add a star emoji reaction to this message" - [Clembs, 2022](https://discord.com/channels/738747595438030888/738747595438030891/978955665647239208)',
      '"racists when they find out what #000000 is" - [navy, 2021](https://discord.com/channels/738747595438030888/738747595438030891/857347672045912064)',
      '"I have 4,58 gigabytes of rotating food." - [venn, 2021](https://discord.com/channels/738747595438030888/738747595438030891/853255032622940171)',
      '*loading resources...*',
      `Sorry ${this.member.user.username}, but your princess is in another castle!`,
      '100% Discord.js free!',
      'Running on not-Purplet v2!',
      '"Together, we will devour the very gods!"',
      '【39 People!】 :heart:',
      '"It\'s no use!"',
      '"Ah yeah, this is happenin\'!"',
      '"It\'s Morbin\' Time!"',
      'RIP Bonk.io tournaments - 2021-2021',
      '"If you\'re over 25 and own a computer, this bot is a must-have!"',
      '"Growing up, I spent hours stomping..."',
      '"Wanna break from the ads? Get Habile Premium for $12.99 to enjoy your bot for longer with no interruptions!"',
      'Also try [CRBT](https://discord.com/api/oauth2/authorize?client_id=595731552709771264&permissions=8&scope=applications.commands%20bot)!',
      '[Live every Saturday!](https://twitch.tv/clembs)',
      'CRBT was here',
      'Not cancelled!',
      '"Was cake a lie?"',
      '"Only 13 attempts!"',
      `Designed and maintained by <@327690719085068289> ${emojis.clembs_happy}`,
      '[Open-source!!1!](https://github.com/Clembs/Habile-Discord)',
      'Memes. The DNA of the soul.',
      '"From the moment in understood the weakness of my flesh... it disgusted me. I craved the strength and certainty of Habile ."',
      '"What up son?"',
      `Hi ${this.member.user.username}! :wave:`,
      '"Doktor. Turn off my Habile inhibitors."',
      '"It\'s been 84 years..."',
      `***hey ${this.member.user.username}... lookin' hot today :smirk:***`,
      '"Good, Great, Awesome, Outstanding, AMAZING!"',
      '"You never grab too many pings!"',
      'New fish every monday!',
      '349 pages of Habile lore',
      '"Habile will never be balling"',
      '"Strange, isn\'t it?"',
      'https://discord.com/channels/738747595438030888/1037100631678275698/1037123628396986368',
      `"Foolishness, ${this.member.user.username}, foolishness."`,
      'Made in Carcassonne!',
      'May contain nuts',
      'Not suitable for teens under 13.',
      'Find me at Pumpkin Hill!',
      `Only on <#${this.channel_id}>`,
      'いただきますー!',
      `Cactiver OP must nerf ${emojis.fish_happy}`,
      'Clembs is not 12!',
    ];
    const phrase = randomPhrases[Math.floor(Math.random() * randomPhrases.length)];

    return InteractionReply({
      embeds: [
        {
          description: dedent`${emojis.habile} ${phrase}
           `,
          fields: [
            {
              name: 'Interaction latency',
              value: `${Date.now() - timestamp.getTime()}ms`,
            },
          ],
          color: colors.default,
        },
      ],
      components: [
        {
          components: [
            createLinkButton('Source code', 'https://github.com/Clembs/Habile-Discord'),
            createLinkButton('Donate', 'https://clembs.com/donate'),
            createLinkButton('Twitch', 'https://twitch.tv/clembs'),
            sendMessage.create(),
          ],
          type: ComponentType.ActionRow,
        },
      ],
      // flags: MessageFlags.SuppressEmbeds,
    });
  },
});
