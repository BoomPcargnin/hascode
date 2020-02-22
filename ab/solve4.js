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

const getBetterLibraries = (daysCount, libraries, bookScores) => {
  const result = [];
  let firtRun = true;
  let betterLibrary = null;
  let tmpDaysCount = daysCount;
  let remainingLibraries = libraries;

  while (firtRun || (remainingLibraries.length && tmpDaysCount > 0 && betterLibrary)) {
    firtRun = false;
    betterLibrary = getBetterLibrary(tmpDaysCount, remainingLibraries, bookScores);
    if (betterLibrary) {
      result.push(betterLibrary);
      tmpDaysCount -= betterLibrary.signupDays;
      betterLibrary.availableBooks.forEach((b) => bookScores[b.id] = 0);
      betterLibrary.books = betterLibrary.availableBooks;
      remainingLibraries = remainingLibraries.filter(l => l.id !== betterLibrary.id)
    }
  }

  return result;
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

  const betterLibraries = getBetterLibraries(daysCount, libraries, bookScores);

  return {
    libraries: betterLibraries, 
  };
}

module.exports = solve;