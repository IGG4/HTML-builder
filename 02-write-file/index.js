const fs = require('fs');
const path = require('path');
const readline = require('readline');

const filePath = path.join(__dirname, 'output.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Welcome! Please enter some text, and it will be written to the file.');
console.log('Type "exit" to quit the program.');

rl.on('line', (input) => {
    if (input.toLowerCase() === 'exit') {
        console.log('Goodbye!');
        rl.close();
        process.exit(0);
    } else {
        writeStream.write(input + '\n');
        console.log('Text saved to file. Enter  text or type "exit" to quit.');
    }
});

rl.on('SIGINT', () => {
    console.log('\nGoodbye!)))');
    rl.close();
    process.exit(0);
});