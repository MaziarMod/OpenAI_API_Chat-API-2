//The readline module is used to read user input from the command line.
import readline from 'readline';

//The yargs library is used for parsing command-line arguments
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';

import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

function bold(text) {
  const bold_start = '\x1b[1m';
  const bold_end = '\x1b[0m';
  return bold_start + text + bold_end;
}

function blue(text) {
  const blue_start = '\x1b[34m';
  const blue_end = '\x1b[0m';
  return blue_start + text + blue_end;
}

function red(text) {
  const red_start = '\x1b[31m';
  const red_end = '\x1b[0m';
  return red_start + text + red_end;
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

function main() {
  const argv = yargs(hideBin(process.argv)).argv;

  if (argv.personality === '') argv.personality = 'friendly and helpful';

  const initial_prompt = `You are a conversational chatbot. Your personality is: ${argv.personality}`;
  const messages = [{ role: 'system', content: initial_prompt }];

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on('line', (user_input) => {
    messages.push({ role: 'user', content: user_input });

    openai
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: messages,
      })
      .then((res) => {
        messages.push(res.data.choices[0].message);
        console.log(
          bold(red('Assistant: ')),
          res.data.choices[0].message.content
        );
        rl.prompt();
      })
      .catch((err) => {
        console.error(err);
        rl.prompt();
      });
  });
  rl.prompt();

  //To exit the program, you can use Ctrl+C to trigger the SIGINT event,
  rl.on('SIGINT', () => {
    console.log('Exiting...');
    rl.close();
  });
}

main();
