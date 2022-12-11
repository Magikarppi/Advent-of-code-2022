const fs = require('fs');

fs.readFile('data.txt', 'utf-8', (err, data) => {
  if (err) {
    return console.log(err);
  }

  function findUnique(str) {
    // The variable that contains the unique values
    let uniq = '';

    for (let i = 0; i < str.length; i++) {
      // Checking if the uniq contains the character
      if (uniq.includes(str[i]) === false) {
        // If the character not present in uniq
        // Concatenate the character with uniq
        uniq += str[i];
      }
    }
    return uniq;
  }

  let startOfPacketMarkers = [];
  let startOfMessageMarkers = [];

  const findFirstMarker = (i, distinctCharsAmount) => {
    let strSlice = data.substring(i, i + distinctCharsAmount);
    const uniqueChars = findUnique(strSlice);
    if (strSlice.length === distinctCharsAmount) {
      if (uniqueChars.length === distinctCharsAmount) {
        const markerAfterCharacter =
          data.indexOf(uniqueChars) + distinctCharsAmount;
        if (distinctCharsAmount === 4) {
          startOfPacketMarkers.push(markerAfterCharacter);
        } else if (distinctCharsAmount === 14) {
          startOfMessageMarkers.push(markerAfterCharacter);
        }
      }
    }
  };

  for (let i = 0; i < data.length; i++) {
    findFirstMarker(i, 4);
    findFirstMarker(i, 14);
  }
  console.log('first start-of-packet-marker: ', startOfPacketMarkers[0]);
  console.log('first start-of-message-marker: ', startOfMessageMarkers[0]);
});
