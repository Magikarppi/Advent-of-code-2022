const { once } = require('node:events');
const fs = require('fs');
const readLine = require('readline');

let scoreString = '';

const scoreMap = new Map();
const alphaLowercase = Array.from(Array(26)).map((e, i) => i + 97);
alphaLowercase.forEach((val, i) => {
  const char = String.fromCharCode(val);
  scoreMap.set(char, i + 1);
});
const alphaUppercase = Array.from(Array(26)).map((e, i) => i + 65);
alphaUppercase.forEach((val, i) => {
  const char = String.fromCharCode(val);
  scoreMap.set(char, i + 27);
});

(async function processLineByLine() {
  try {
    const lineReader = readLine.createInterface({
      input: fs.createReadStream('data.txt'),
    });
    lineReader.on('line', (line) => {
      const compartmentOne = line.substring(0, line.length / 2);
      const compartmentTwo = line.substring(line.length / 2);

      let uniqueChars = '';
      for (let i = 0; i < compartmentOne.length; i++) {
        const currCompOneChar = compartmentOne[i];
        for (let j = 0; j < compartmentTwo.length; j++) {
          const currCompTwoChar = compartmentTwo[j];
          if (currCompTwoChar === currCompOneChar) {
            if (uniqueChars.indexOf(currCompTwoChar) === -1)
              uniqueChars = uniqueChars + currCompTwoChar;
          }
        }
      }
      scoreString = scoreString + uniqueChars;
    });

    await once(lineReader, 'close');

    let score = 0;
    for (c of scoreString) {
      score = score + scoreMap.get(c);
    }
    console.log('score: ', score);
  } catch (error) {
    console.log(error);
  }
})();
