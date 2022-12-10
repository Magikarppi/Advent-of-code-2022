const fs = require('fs');

const organizeCratesByColumns = (crateSection, columnIndexes) => {
  const columns = columnIndexes.length;

  let cratesByColumns = {};
  // create an object that has keys that correspond to column numbers and values which are arrays of crate ids like ["Z", "C"]
  for (let i = 1; i <= columns; i++) {
    cratesByColumns[i] = [];
  }

  // parse data from text input to the crates-column object
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

const parseMoves = (move) => {
  // get amount of crates to move
  let crateAmount = '';
  const crateAmountStartIndex = move.indexOf(' ') + 1;
  const crateAmountEndIndex = move.indexOf(' ', crateAmountStartIndex + 1);
  const crateAmountLength = crateAmountEndIndex - crateAmountStartIndex;

  if (crateAmountLength === 1) {
    crateAmount = move[crateAmountStartIndex];
  } else if (crateAmountLength === 2) {
    crateAmount = move[crateAmountStartIndex] + move[crateAmountStartIndex + 1];
  }

  const indexOfWordFrom = move.indexOf('from');
  const moveFromStartIndex = move.indexOf(' ', indexOfWordFrom) + 1;
  const moveFromEndIndex = move.indexOf(' ', moveFromStartIndex + 1);
  const moveFromLength = moveFromEndIndex - moveFromStartIndex;

  // get which crate column to move crates from
  let moveFrom = '';
  if (moveFromLength === 1) {
    moveFrom = move[moveFromStartIndex];
  } else if (moveFromLength === 2) {
    moveFrom = move[moveFromStartIndex] + move[moveFromStartIndex + 1];
  }

  // get which crate column to move crates to
  let moveTo = '';
  const indexOfWordTo = move.indexOf('to');
  const moveToStartIndex = move.indexOf(' ', indexOfWordTo) + 1;
  moveTo = move[moveToStartIndex];

  return { crateAmount, moveFrom, moveTo };
};

const moveOneByOne = (parsedMoves, cratesByColumns) => {
  const { moveFrom, moveTo } = parsedMoves;
  cratesByColumns[moveTo].unshift(cratesByColumns[moveFrom].shift());
  return cratesByColumns;
};

const moveMultiple = (parsedMoves, cratesByColumns) => {
  const { crateAmount, moveFrom, moveTo } = parsedMoves;
  const crateColumnSlice = cratesByColumns[moveFrom].splice(0, crateAmount);
  cratesByColumns[moveTo].unshift(...crateColumnSlice);
  return cratesByColumns;
};

const moveCrates = (moves, cratesByColumns) => {
  // copy crates
  let movedCratesOneByOne = JSON.parse(JSON.stringify(cratesByColumns));
  let movedCratesMultiple = JSON.parse(JSON.stringify(cratesByColumns));
  // move crates for every move
  for (let i = 0; i < moves.length; i++) {
    const parsedMoves = parseMoves(moves[i]);
    const { crateAmount } = parsedMoves;

    for (let j = 0; j < parseInt(crateAmount); j++) {
      // move crates one by one (part1)
      movedCratesOneByOne = moveOneByOne(parsedMoves, movedCratesOneByOne);
    }
    // move crates multiple at time (part2)
    movedCratesMultiple = moveMultiple(parsedMoves, movedCratesMultiple);
  }
  return { movedCratesOneByOne, movedCratesMultiple };
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

  // determine which raw string indexes are for different columns
  let columnIndexes = [];
  for (let i = 0; i < dataAsArray[indexOfSectionBreak - 1].length; i++) {
    if (parseInt(dataAsArray[indexOfSectionBreak - 1][i]) > 0) {
      columnIndexes.push(i);
    }
  }

  // get the crates section from the data
  let crateSection = dataAsArray.slice(0, indexOfSectionBreak - 1);
  const cratesByColumns = organizeCratesByColumns(crateSection, columnIndexes);
  const { movedCratesOneByOne, movedCratesMultiple } = moveCrates(
    dataAsArray.slice(indexOfSectionBreak + 1),
    cratesByColumns
  );
  const topCratesMovedOneByOne = getTopCrates(movedCratesOneByOne);
  const topCratesMovedMultiple = getTopCrates(movedCratesMultiple);
  console.log('top-crates-moved-one-by-one: ', topCratesMovedOneByOne);
  console.log('top-crates-moved-multiple: ', topCratesMovedMultiple);
});
