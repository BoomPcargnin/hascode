const compute = require('../compute');

const getBetterLibraries = (daysCount, libraries) => {
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
  
    const aScore = (1 / aSignup) * aBookScore;
    const bScore = (1 / bSignup) * bBookScore;
  
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

  return {
    libraries: getBetterLibraries(daysCount, libraries), 
  };
}

module.exports = solve;