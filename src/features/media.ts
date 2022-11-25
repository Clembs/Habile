import { $autocomplete, $slashCommand, getEnv, InteractionReply } from '$core';
import {
  APIApplicationCommandInteractionDataStringOption,
  ApplicationCommandOptionType,
} from 'discord-api-types/v10';

export default $slashCommand({
  name: 'm',
  description: 'Send the clembs.com/media URL for the corresponding file name.',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'file',
      description: 'The file URL to send.',
      required: true,
      autocomplete: true,
    },
  ],
  async handle() {
    const url = this.data.options[0] as APIApplicationCommandInteractionDataStringOption;

    return InteractionReply({
      content: url.value,
    });
  },
});

export const handleMediaAutocomplete = $autocomplete({
  commandName: 'm',
  optionName: 'file',
  async handle() {
    const env = getEnv();
    const url = (this.data.options[0] as APIApplicationCommandInteractionDataStringOption).value;

    const res: {
      files: any[];
    } = await fetch('https://api004.backblazeb2.com/b2api/v2/b2_list_file_names', {
      method: 'POST',
      headers: {
        Authorization: env.BACKBLAZE_TOKEN,
        'Cache-Control': 'max-age=15000',
      },
      body: JSON.stringify({
        bucketId: env.BACKBLAZE_BUCKET_ID,
        maxFileCount: 500,
      }),
      cf: {
        cacheTtl: 36000,
        cacheEverything: true,
      },
    }).then((r) => r.json());

    const choices = res.files
      .filter(({ fileName }) => fileName.toLowerCase().includes(url.toLowerCase()))
      .slice(0, 25)
      .map((file) => {
        return {
          name: file.fileName,
          value: `https://clembs.com/media/${file.fileName}`,
        };
      });

    return {
      choices,
    };
  },
});
