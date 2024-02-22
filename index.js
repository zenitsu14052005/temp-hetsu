const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.end(`
    <html>
      <head>
        <title>Your Web View</title>
      </head>
      <body style="margin: 0; padding: 0;">
        <iframe width="100%" height="100%" src="https://axocoder.vercel.app/" frameborder="0" allowfullscreen></iframe>
      </body>
    </html>`);
});

server.listen(3000, () => {
  console.log('Server Online because of Axo Coder ✅!!');
});

const {
  Client,
  MessageButton,
  MessageActionRow,
  MessageSelectMenu,
  TextInputComponent,
  Modal,
  MessageEmbed,
} = require("discord.js");
const config = require("./config.json");
const { startServer } = require("./alive.js");
const { Database } = require("st.db");
const temp_channels_db = new Database("./temp_channels.json");

// Remove the HTTP server setup
// const http = require("http");
// http
//   .createServer(function (req, res) {
//     res.write("I'm alive");
//     res.end();
//   })
//   .listen(8080);

const client = new Client({
  intents: 32767,
});

client.on("ready", async () => {
  console.log("Bot is online!");
  console.log("Code by Wick Studio");
  console.log(" discord.gg/z82w57MzUC");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;
  if (message.content.startsWith(config.prefix + "temp")) {
    if (!message.member.permissions.has("ADMINISTRATOR"))
      return message.reply("You do not have permission to use this ❌");

    let args = message.content.split(" ");
    let embeds = [
      {
        author: {
          name: "Temp Channel Dashboard",
          icon_url: message.guild.iconURL(),
        },
        description: `Press the buttons below to control your Vc`,
        image: {
          url: `https://cdn.discordapp.com/attachments/1115220304629874720/1210276245812543548/export.png?ex=65e9f896&is=65d78396&hm=3e8baefe384d0ba9ca3253ab09471f3af6d9a83e4bf55dd423b0397613789948&`,
        },
        color: 0x0cd8fa,
      },
    ];
    let MessageSelectMenuOptions = [];
    config.voiceLimits.forEach((num) => {
      MessageSelectMenuOptions.push({
        label: `${num == 0 ? "No Limit" : num}`,
        value: `${num}`,
      });
    });

    let row1 = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`temp_public_${Date.now()}`)
        .setStyle("SECONDARY")
        .setEmoji(config.emojis.public)
        .setLabel("Unlock"),
      new MessageButton()
        .setCustomId(`temp_private_${Date.now()}`)
        .setStyle("SECONDARY")
        .setEmoji(config.emojis.private)
        .setLabel("Lock"),
      new MessageButton()
        .setCustomId(`temp_unmute_${Date.now()}`)
        .setStyle("SECONDARY")
        .setEmoji(config.emojis.unmute)
        .setLabel("Unmute"),
      new MessageButton()
        .setCustomId(`temp_mute_${Date.now()}`)
        .setStyle("SECONDARY")
        .setEmoji(config.emojis.mute)
        .setLabel("Mute"),
      new MessageButton()
        .setCustomId(`temp_rename_${Date.now()}`)
        .setStyle("SECONDARY")
        .setEmoji(config.emojis.rename)
        .setLabel("Change Name"),
    );

    let row2 = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId(`temp_disconnect_${Date.now()}`)
        .setStyle("DANGER")
        .setEmoji(config.emojis.disconnect)
        .setLabel("Disconnect"),
      new MessageButton()
        .setCustomId(`temp_hide_${Date.now()}`)
        .setStyle("PRIMARY")
        .setEmoji(config.emojis.hide)
        .setLabel("Hide"),
      new MessageButton()
        .setCustomId(`temp_unhide_${Date.now()}`)
        .setStyle("PRIMARY")
        .setEmoji(config.emojis.unhide)
        .setLabel("Unhide"),
      new MessageButton()
        .setCustomId(`temp_kickuser_${Date.now()}`)
        .setStyle("PRIMARY")
        .setEmoji(config.emojis.unhide)
        .setLabel("Kick User"),
      new MessageButton()
        .setCustomId(`temp_permit_${Date.now()}`)
        .setStyle("PRIMARY")
        .setEmoji(config.emojis.permit) // Assuming you have an emoji named "permit"
        .setLabel("Permit Transfer"),
    );


    let row3 = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("temp_limit_" + Date.now())
        .setPlaceholder("members limit")
        .setMaxValues(1)
        .setMinValues(1)
        .addOptions(MessageSelectMenuOptions),
    );

    message.channel
      .send({ embeds, components: [row1, row2, row3] })
      .then(() => {
        message.delete().catch(() => {});
      });
  }
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  if (
    newState.channelId !== null &&
    newState.channelId == config.channelVoiceId
  ) {
    newState.guild.channels
      .create(newState.member.user.username, {
        permissionOverwrites: [
          {
            id: newState.member.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "MANAGE_CHANNELS"],
          },
          {
            id: newState.guild.id,
            deny: ["SEND_MESSAGES"],
          },
        ],
        parent: config.categoryId,
        type
