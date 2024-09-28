
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] 
});
const cors = require("cors");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.post('/check-discord-user', async (req, res) => {
  const { username } = req.body;
  try {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const member = guild.members.cache.find(member => member.user.tag === username);
    if (!member) {
      return res.status(404).json({
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