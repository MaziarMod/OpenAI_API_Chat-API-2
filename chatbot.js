import readline from 'readline';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages = [];

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function getUserInput() {
  rl.question('\x1b[1m\x1b[34mYou: \x1b[0m', (userInput) => {
    messages.push({ role: 'user', content: userInput });

    openai
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages,
      })
      .then((res) => {
        messages.push(res.data.choices[0].message);
        console.log(
          '\x1b[1m\x1b[31mAssistant: \x1b[0m',
          res.data.choices[0].message.content
        );
        getUserInput();
      })
      .catch((err) => {
        console.error(err);
        getUserInput();
      });
  });
}

process.on('SIGINT', () => {
  console.log('Exiting...');
  rl.close();
  process.exit();
});

getUserInput();
