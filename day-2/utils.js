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

const points = {
  Y: 2,
  X: 1,
  Z: 3,
};

const playerWins = {
  Y: 'A',
  X: 'C',
  Z: 'B',
};

const playerLoses = {
  Y: 'C',
  X: 'B',
  Z: 'A',
};

const playerDraws = {
  Y: 'B',
  X: 'A',
  Z: 'C',
};

const countPoints = (opponentMove, playerMove) => {
  let pointCount = 0;

  function addWinPoints() {
    pointCount = pointCount + points[playerMove] + 6;
  }

  function addDrawPoints() {
    pointCount = pointCount + points[playerMove] + 3;
  }

  function addLossPoints() {
    pointCount = pointCount + points[playerMove];
  }

  if (playerWins[playerMove] === opponentMove) {
    addWinPoints();
  } else if (playerDraws[playerMove] === opponentMove) {
    addDrawPoints();
  } else {
    addLossPoints();
  }
  return pointCount;
};

const determinePlayerMove = (opponentMove, desiredRoundResult) => {
  // desiredRoundResult:
  // X = Lose
  // Y = Draw
  // Z = Win
  if (desiredRoundResult === 'X') {
    return Object.keys(playerLoses).find(
      (key) => playerLoses[key] === opponentMove
    );
  } else if (desiredRoundResult === 'Y') {
    return Object.keys(playerDraws).find(
      (key) => playerDraws[key] === opponentMove
    );
  } else {
    return Object.keys(playerWins).find(
      (key) => playerWins[key] === opponentMove
    );
  }
};

module.exports = {
  countPoints,
  determinePlayerMove,
};
