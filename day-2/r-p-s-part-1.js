const { once } = require('node:events');
const fs = require('fs');
const readLine = require('readline');

const { countPoints } = require('./utils');

let total = 0;

(async function processLineByLine() {
  try {
    const lineReader = readLine.createInterface({
      input: fs.createReadStream('data.txt'),
    });
    lineReader.on('line', (line) => {
      const opponentMove = line[0];
      const playerMove = line[2];

      total = total + countPoints(opponentMove, playerMove);
    });

    await once(lineReader, 'close');
    console.log('total: ', total);
  } catch (error) {
    console.log(error);
  }
})();
