// const readFile = require('node:fs/promises');
const fs = require('fs');

fs.readFile('data.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }

  let overlapCompletelyCount = 0;
  let overlapPartiallyCount = 0;

  const dataArr = data.split('\n');

  for (let i = 0; i < dataArr.length; i++) {
    const line = dataArr[i];
    const comma = line.indexOf(',');
    const sect1 = line.substring(0, comma);
    const sect2 = line.substring(comma + 1);

    const findDash = (input) => {
      return input.indexOf('-');
    };

    const findSectionStart = (section) => {
      return section.substring(0, findDash(section));
    };

    const findSectionEnd = (section) => {
      return section.substring(findDash(section) + 1);
    };

    const sect1Begin = parseInt(findSectionStart(sect1));
    const sect1End = parseInt(findSectionEnd(sect1));

    const sect2Begin = parseInt(findSectionStart(sect2));
    const sect2End = parseInt(findSectionEnd(sect2));

    const sect1InSect2 = sect1Begin >= sect2Begin && sect1End <= sect2End;
    const sect2InSect1 = sect2Begin >= sect1Begin && sect2End <= sect1End;
    const someOverlap =
      (sect1Begin >= sect2Begin && sect1Begin <= sect2End) ||
      (sect2Begin >= sect1Begin && sect2End <= sect1End) ||
      (sect2End >= sect1End && sect2Begin <= sect1End);

    if (sect1InSect2 || sect2InSect1) {
      overlapCompletelyCount++;
    }

    if (someOverlap) {
      overlapPartiallyCount++;
    }
  }

  console.log('overlapCompletelyCount: ', overlapCompletelyCount);
  console.log('overlapPartially: ', overlapPartiallyCount);
});
