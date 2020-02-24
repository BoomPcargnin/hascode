const compute = require('../compute');

const getUnusedBooks = (library, bookScores) => {
  return library.books.filter(b => bookScores[b.id] > 0);
};

const getBetterLibrary = (daysCount, libraries, bookScores) => {
  let maxScore = 0;
  let maxLibrary = null;

  libraries.forEach((library) => {
    const totalBooks = (daysCount - library.signupDays) * library.booksPerDay;

    const unusedBooks = getUnusedBooks(library, bookScores);

    const availableBooks = unusedBooks
      .filter((b, index) => index < totalBooks);

    library.availableBooks = availableBooks;

    const bookScore = availableBooks
      .reduce((acc, b) => acc + bookScores[b.id], 0);

    const score = bookScore * (1 / library.signupDays);
    if (score > maxScore) {
      maxScore = score;
      maxLibrary = library;
    }
  });

  return maxLibrary;
}

const getBetterLibraries = (parsed, daysCount, libraries, originalBookScores, iterations, random) => {
  let maxResult = null;
  let maxPoints = 0;

  for (let i = 0; i < iterations; i += 1) {
    const bookScores = [...originalBookScores];
    if (i !== 0 && i % 10 === 0) {
      console.log(i);
    }
    const result = [];
    let firtRun = true;
    let betterLibrary = null;
    let tmpDaysCount = daysCount;
    let remainingLibraries = JSON.parse(JSON.stringify(libraries));

    while (firtRun || (remainingLibraries.length && tmpDaysCount > 0 && betterLibrary)) {
      firtRun = false;
      betterLibrary = getBetterLibrary(tmpDaysCount, remainingLibraries, bookScores);
      const prob = Math.random() > random;
      if (betterLibrary && prob) {
        result.push(betterLibrary);
        tmpDaysCount -= betterLibrary.signupDays;
        betterLibrary.availableBooks.forEach((b) => bookScores[b.id] = 0);
        remainingLibraries = remainingLibraries.filter(l => l.id !== betterLibrary.id)
      }
    }

    const toCount = JSON.parse(JSON.stringify(result))
    toCount.forEach((l) => l.books = l.availableBooks);

    const { points, ipoteticalMaxPoints } = compute(parsed, { libraries: toCount });
    // [18.92%]
    if (points > maxPoints) {
      if (maxPoints > 0 ) {
        console.log('better')
      }
      maxResult = result;
      maxPoints = points;
    }

    if (ipoteticalMaxPoints === maxPoints) {
      console.log('max');
      i = iterations + 1;
    }
  }

  return maxResult;
}


const sortBooks = (libraries) => {
  libraries.forEach((l) => {
    l.books.sort((a, b) => b.score - a.score);
  });
}

const solve = (parsed) => {
  const { 
      books,
      daysCount,
      libraries,
  } = parsed;

  const bookScores = books.map(b => b.score);
  sortBooks(libraries);

  const betterLibraries = getBetterLibraries(parsed, daysCount, libraries, bookScores, 1000, 0.25);

  betterLibraries.forEach((l) => l.books = l.availableBooks);

  return {
    libraries: betterLibraries, 
  };
}

module.exports = solve;