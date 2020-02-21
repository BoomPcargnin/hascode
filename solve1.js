const getBetterLibraries = (daysCount, libraries) => {
  const newLibraries = JSON.parse(JSON.stringify(libraries));
  
  newLibraries.sort((a, b) => {
    a.books.sort((kk, kk1) => kk1.score - kk.score);
    b.books.sort((kk, kk1) => kk1.score - kk.score);

    const aSignup = a.signupDays;
    const aBookPerDays = a.booksPerDay;

    const bSignup = a.signupDays;
    const bBookPerDays = a.booksPerDay;

    const aScore = a.books
      .filter((_item, index) => index < (daysCount - aSignup) * aBookPerDays)
      .reduce((acc, book) => acc + book.score, 0);

    const bScore = b.books
      .filter((_item, index) => index < (daysCount - bSignup) * bBookPerDays)
      .reduce((acc, book) => acc + book.score, 0);

      return bScore - aScore;  
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