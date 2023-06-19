require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');
const { NlpManager } = require('node-nlp');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const nlpManager = new NlpManager({ languages: ['en'] });

// Add training data to the NLP manager
nlpManager.addDocument('en', 'What chat would you recommend for {question}?', 'suggestChat');
nlpManager.addAnswer('en', 'suggestChat', 'You should try Chat 1');
nlpManager.addAnswer('en', 'suggestChat', 'I suggest Chat 2');
nlpManager.addAnswer('en', 'suggestChat', 'Chat 3 might be a good option');

// Train the NLP manager
nlpManager.train();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', (message) => {
    if (message.content.startsWith('!suggest')) {
        const question = message.content.slice(9); // Extract the question from the message content

        // Process the user question with NLP manager
        nlpManager.process('en', question)
            .then((response) => {
                const answer = response.answer || 'I don\'t have any suggestions at the moment.';
                message.channel.send(answer);
            })
            .catch((error) => {
                console.error(error);
                message.channel.send('Oops! Something went wrong while processing the question.');
            });
    }
});
client.login(process.env.DISCORD_TOKEN);xSASWDX