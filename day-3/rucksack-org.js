const { once } = require('node:events');
const fs = require('fs');
const readLine = require('readline');

let itemTypes = '';
let linesArr = [];
let badgeTypes = '';

const supplyItemsScore = (line) => {
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
  itemTypes = itemTypes + uniqueChars;
};

const calculateScoreFromScoreString = (scoreString) => {
  const scoreMap = new Map();
  const alphaLowercase = Array.from(Array(26)).map((_e, i) => i + 97);
  alphaLowercase.forEach((val, i) => {
    const char = String.fromCharCode(val);
    scoreMap.set(char, i + 1);
  });
  const alphaUppercase = Array.from(Array(26)).map((_e, i) => i + 65);
  alphaUppercase.forEach((val, i) => {
    const char = String.fromCharCode(val);
    scoreMap.set(char, i + 27);
  });

  let score = 0;
  for (c of scoreString) {
    score = score + scoreMap.get(c);
  }
  return score;
};

const findBadgeTypes = (linesPatch) => {
  const x = linesPatch[0];
  const y = linesPatch[1];
  const o = linesPatch[2];

  let uniqueChars = '';
  for (let i = 0; i < x.length; i++) {
    for (let j = 0; j < y.length; j++) {
      for (let k = 0; k < o.length; k++) {
        if (x[i] === o[k] && y[j] === o[k]) {
          if (uniqueChars.indexOf(o[k]) === -1) {
            uniqueChars = uniqueChars + o[k];
          }
        }
      }
    }
  }
  badgeTypes = badgeTypes + uniqueChars;
};

(async function processLineByLine() {
  try {
    const lineReader = readLine.createInterface({
      input: fs.createReadStream('data.txt'),
    });
    lineReader.on('line', (line) => {
      supplyItemsScore(line);
      linesArr.push(line);
    });

    await once(lineReader, 'close');

    console.log(
      'supply items score: ',
      calculateScoreFromScoreString(itemTypes)
    );

    let sliceStart = 0;
    while (sliceStart < linesArr.length) {
      const linesArrSlice = linesArr.slice(sliceStart, sliceStart + 3);
      findBadgeTypes(linesArrSlice);
      sliceStart += 3;
    }

    console.log('badgeScore; ', calculateScoreFromScoreString(badgeTypes));
  } catch (error) {
    console.log(error);
  }
})();
