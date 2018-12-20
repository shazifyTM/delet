const Command = require("../../base/Command.js");
const snekfetch = require("snekfetch");
const { RichEmbed } = require("discord.js");
const { UNSPLASH_ACCESS_KEY } = process.env;

class Snake extends Command {
    constructor(client) {
      super(client, {
        name: "snake",
        description: "Sends a random image of a snake.",
        category: "Image",
        usage: "snake",
        aliases: ["snek"]
      });
    }

    async run(message, args, level, settings, texts) { // eslint-disable-line no-unused-vars
        const page = Math.floor(Math.random() * 5) + 1;
        const index = Math.floor(Math.random() * 10) + 1;

        const randomColor = "#0000".replace(/0/g, () => {
          return (~~(Math.random() * 16)).toString(16);
        });

        message.channel.startTyping();

        try {
          const { body } = await snekfetch
            .get(`https://api.unsplash.com/search/photos?page=${page}`)
            .query({ query: "snake" })
            .set({ Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` });

          const data = body.results[parseInt(index.toFixed(0))];

          const embed = new RichEmbed()
            .setTitle("🐍 Snake")
            .setURL(data.urls.raw)
            .setDescription(`Photo by [${data.user.name}](${data.user.links.html}) on [Unsplash](https://unsplash.com)`)
            .setImage(data.urls.raw)
            .setColor(randomColor)
            .setTimestamp();
          message.channel.send({ embed });
          message.channel.stopTyping(true);
        } catch (error) {
          if (error.message === "Cannot read property 'urls' of undefined") return message.channel.send("An error occurred during the request. Please try again.");
          this.client.logger.error(error);
          return message.channel.send(texts.general.error.replace(/{{err}}/g, error.message));
        }
    }
}

module.exports = Snake;
