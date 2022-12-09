const fs = require('fs');

const organizeCratesByColumns = (crateSection, columnIndexes) => {
  const columns = columnIndexes.length;

  let cratesByColumns = {};
  for (let i = 1; i <= columns; i++) {
    cratesByColumns[i] = [];
  }

  for (let i = 0; i < crateSection.length; i++) {
    for (let j = 0; j < columnIndexes.length; j++) {
      const currColumnValue = crateSection[i][columnIndexes[j]];
      const valueIsLetter =
        currColumnValue.length === 1 && currColumnValue.match(/[a-z]/i);
      if (valueIsLetter) {
        cratesByColumns[j + 1].push(currColumnValue);
      }
    }
  }
  return cratesByColumns;
};

const moveCrates = (moves, cratesByColumns) => {
  for (let i = 0; i < moves.length; i++) {
    const move = moves[i];

    let crateAmount = '';
    const crateAmountStartIndex = move.indexOf(' ') + 1;
    const crateAmountEndIndex = move.indexOf(' ', crateAmountStartIndex + 1);
    const crateAmountLength = crateAmountEndIndex - crateAmountStartIndex;

    if (crateAmountLength === 1) {
      crateAmount = move[crateAmountStartIndex];
    } else if (crateAmountLength === 2) {
      crateAmount =
        move[crateAmountStartIndex] + move[crateAmountStartIndex + 1];
    }

    const indexOfWordFrom = move.indexOf('from');
    const moveFromStartIndex = move.indexOf(' ', indexOfWordFrom) + 1;
    const moveFromEndIndex = move.indexOf(' ', moveFromStartIndex + 1);
    const moveFromLength = moveFromEndIndex - moveFromStartIndex;

    let moveFrom = '';
    if (moveFromLength === 1) {
      moveFrom = move[moveFromStartIndex];
    } else if (moveFromLength === 2) {
      moveFrom = move[moveFromStartIndex] + move[moveFromStartIndex + 1];
    }

    const indexOfWordTo = move.indexOf('to');
    const moveToStartIndex = move.indexOf(' ', indexOfWordTo) + 1;

    let moveTo = '';

    moveTo = move[moveToStartIndex];

    for (let j = 0; j < parseInt(crateAmount); j++) {
      cratesByColumns[moveTo].unshift(cratesByColumns[moveFrom].shift());
    }
    moveFrom = '';
    moveTo = '';
    crateAmount = '';
  }
  return cratesByColumns;
};

const getTopCrates = (cratesByColumns) => {
  let topCrates = '';
  for (const [_key, value] of Object.entries(cratesByColumns)) {
    topCrates = topCrates + value[0];
  }
  return topCrates;
};

fs.readFile('data.txt', 'utf-8', (err, data) => {
  if (err) {
    return console.log(err);
  }

  const dataAsArray = data.split('\n');
  const indexOfSectionBreak = dataAsArray.indexOf(
    dataAsArray.reduce((a, b) => (a.length <= b.length ? a : b))
  );

  let columnIndexes = [];
  for (let i = 0; i < dataAsArray[indexOfSectionBreak - 1].length; i++) {
    if (parseInt(dataAsArray[indexOfSectionBreak - 1][i]) > 0) {
      columnIndexes.push(i);
    }
  }

  let crateSection = dataAsArray.slice(0, indexOfSectionBreak - 1);
  const cratesByColumns = organizeCratesByColumns(crateSection, columnIndexes);
  const movedCrates = moveCrates(
    dataAsArray.slice(indexOfSectionBreak + 1),
    cratesByColumns
  );
  const topCrates = getTopCrates(movedCrates);
  console.log('top-crates: ', topCrates);
});
