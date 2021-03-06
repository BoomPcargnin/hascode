const getBetterLibraries = (daysCount, libraries, bookScorePerDay) => {
  const newLibraries = JSON.parse(JSON.stringify(libraries));
  
  newLibraries.sort((a, b) => {
    a.books.sort((kk, kk1) => kk1.score - kk.score);
    b.books.sort((kk, kk1) => kk1.score - kk.score);

    const aSignup = a.signupDays;
    const aTotalBooks = (daysCount - aSignup) * a.booksPerDay;

    const bSignup = b.signupDays;
    const bTotalBooks = (daysCount - bSignup) * b.booksPerDay;

    const aBookScore = a.books
      .filter((_item, index) => index < aTotalBooks)
      .reduce((acc, book) => acc + book.score, 0);

    const bBookScore = b.books
      .filter((_item, index) => index < bTotalBooks)
      .reduce((acc, book) => acc + book.score, 0);

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

const solve = (parsed) => {
  const { 
      books,
      daysCount,
      libraries,
  } = parsed;

  const bookScorePerDay = books.reduce((acc, b) => acc + b.score, 10) / daysCount;

  return {
    libraries: getBetterLibraries(daysCount, libraries, bookScorePerDay), 
  };
}

module.exports = solve;