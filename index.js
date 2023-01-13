// Create a Discord bot using OpneAI API that interacts on the discord server
require('dotenv').config();

// Prepare to connect to the Discord API
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
] });

// Prepare to connect to the OpenAI API
const { Configuration, OpenAIApi } = require('openai');
const config = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(config);

// Check for a message from a user
client.on('messageCreate', async function(message) {
    try{
        // Ignore messages from the bot itself
        if(message.author.bot) return;
        const gptResponse = await openai.createCompletion({
            model: "davinci",
            prompt: `ChatGPT is a friendly chatbot.\n\
            ChatGPT: Hello, how are you?\n\
            ${message.author.username}: ${message.content}\n\
            ChatGPT:`,
            temperature: 0.9,
            max_tokens: 100,
            stop: ["ChatGPT:", `${message.author.username}:`],
        });
        message.reply(`${gptResponse.data.choices[0].text}`);
        return;
    }   
    catch(err){
        console.log(err);
    }
});
// Log in to the Discord API
client.login(process.env.DISCORD_TOKEN);
console.log("UMM ChatGPT is online!");