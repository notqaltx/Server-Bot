require('dotenv').config()
const Discord = require('discord.js');
const { Client, GatewayIntentBits } = Discord;
const client = new Client({
  intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
  ]
});
const cors = require("cors");
const express = require("express");
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", `${process.env.SERVER_URL}`);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(cors({ origin: '*' }));
app.options('*', cors());
app.use(express.json());
app.use(express.static("public"));

app.post('/check-discord-user', async (req, res) => {
  const { username } = req.body;
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const member = guild.members.cache.find(member => member.user.tag === username);
    if (!member) {
      return res.status(400).json({
        errorcode: '4000',
        message: 'User not found in the server',
      });
    }
    return res.status(200).json({
      errorcode: '4001',
      message: 'User is in the server',
      member: member.user,
    });
  } catch (error) {
    console.error('Error fetching member:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
const listener = app.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
client.login(process.env.TOKEN);