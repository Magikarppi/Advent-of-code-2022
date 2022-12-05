// Opponent:
// A (Rock)
// B (Paper)
// C (Scissors)

// You
// Y (Paper)    = 2 points
// X (Rock)     = 1 point
// Z (Scissors) = 3 points

// Win = 6 points
// Draw = 3 points
// Loss = 0 points

// Y beats A
// X beats C
// Z beats B
// Y draw B
// X draw A
// Z draw C

const { once } = require('node:events');
const fs = require('fs');
const readLine = require('readline');

let total = 0;

(async function processLineByLine() {
  try {
    const lineReader = readLine.createInterface({
      input: fs.createReadStream('data.txt'),
    });
    lineReader.on('line', (line) => {
      const points = {
        Y: 2,
        X: 1,
        Z: 3,
      };

      const opponentMove = line[0];
      const playerMove = line[2];

      function addWinPoints() {
        total = total + points[playerMove] + 6;
      }

      function addDrawPoints() {
        total = total + points[playerMove] + 3;
      }

      function addLossPoints() {
        total = total + points[playerMove];
      }

      const playerWins = {
        Y: 'A',
        X: 'C',
        Z: 'B',
      };

      const draws = {
        Y: 'B',
        X: 'A',
        Z: 'C',
      };

      if (playerWins[playerMove] === opponentMove) {
        addWinPoints();
      } else if (draws[playerMove] === opponentMove) {
        addDrawPoints();
      } else {
        addLossPoints();
      }
    });

    await once(lineReader, 'close');
    console.log('total: ', total);
  } catch (error) {
    console.log(error);
  }
})();
