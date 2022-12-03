const fs = require('fs');

fs.readFile('data2.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const sum = (arr) => arr.reduce((p, c) => p + c);

  // Add pipe char where each set of calories ends
  const formattedData = data.replaceAll(
    /(\n\r|\n|\r)(\n\r|\n|\r)(\n\r|\n|\r)/g,
    '|'
  );
  let currentCalorieCarriage = [];
  let currentCalorie = '';
  let currentHigh = 0;

  for (let i = 0; i < formattedData.length; i++) {
    const currChar = formattedData[i];

    // if current character is a number concatenate it to currentCalorie
    const isNum = !isNaN(parseInt(currChar));
    if (isNum) {
      currentCalorie = currentCalorie + currChar;
    }

    // if current char is a new line add the now formulated currentCalorie to array of current elf's carry
    if (currChar === '\n') {
      currentCalorieCarriage.push(parseInt(currentCalorie));
      currentCalorie = '';
    }

    // if pipe push current complete calorie value to carriage-array
    if (currChar === '|') {
      currentCalorieCarriage.push(parseInt(currentCalorie));
      const blockSum = sum(currentCalorieCarriage);
      // if calculated sum for calories is greater than current high, update current high
      if (blockSum > currentHigh) {
        currentHigh = blockSum;
      }
      // reset for a new set
      currentCalorie = '';
      currentCalorieCarriage = [];
    }
  }

  console.log('currentHigh', currentHigh);
});
