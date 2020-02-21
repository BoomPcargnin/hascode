const getBetterLibraries = (daysCount, libraries, bookScoreArray) => {
  const bookSum = bookScoreArray.reduce((acc, i) => acc + i, 0);
  const bookScorePerDay = bookSum / daysCount;
  const newLibraries = JSON.parse(JSON.stringify(libraries));
  
  newLibraries.sort((a, b) => {
    a.books.sort((kk, kk1) => bookScoreArray[kk1.id] - bookScoreArray[kk.id]);
    b.books.sort((kk, kk1) => bookScoreArray[kk1.id] - bookScoreArray[kk.id]);

    const aSignup = a.signupDays;
    const aTotalBooks = (daysCount - aSignup) * a.booksPerDay;

    const bSignup = a.signupDays;
    const bTotalBooks = (daysCount - bSignup) * b.booksPerDay;

    const aBookScore = a.books
      .filter((_item, index) => index < aTotalBooks)
      .reduce((acc, book) => acc + bookScoreArray[book.id], 0);

    const bBookScore = b.books
      .filter((_item, index) => index < bTotalBooks)
      .reduce((acc, book) => acc + bookScoreArray[book.id], 0);

    const aPenalty = aSignup * bookScorePerDay;
    const bPenalty = aSignup * bookScorePerDay;

    const aScore = aBookScore - aPenalty;
    const bScore = bBookScore - bPenalty;

    if (bScore > aScore) {
      return 1;
    }
    else {
      return -1;
    }
  });

  return newLibraries;
}

const recursiveSort = (daysCount, libraries, bookScoreArray, result) => {
  if (libraries.length > 0 && daysCount > 0) {
    const orderedLibraries = getBetterLibraries(daysCount, libraries, bookScoreArray);
    const bestLibrary = orderedLibraries[0];
    result.push(bestLibrary);
    const howManyBooks = (daysCount - bestLibrary.signupDays) * bestLibrary.booksPerDay;
    bestLibrary.books
      .filter((book, index) => index < howManyBooks)
      .forEach((book) => {
        bookScoreArray[book.id] = 0;
      }
    );
    recursiveSort(daysCount - bestLibrary.signupDays, libraries.filter(l => l.id !== bestLibrary.id), bookScoreArray, result);
  }
  return result;
};

const solve = (parsed) => {
  const { 
      books,
      daysCount,
      libraries,
  } = parsed;

  const bookScoreArray = books.map((b) => b.score);

  return {
    libraries: recursiveSort(daysCount, libraries, bookScoreArray, []), 
  };
}

module.exports = solve;