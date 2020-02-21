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

    const aBookSum = a.books
      .reduce((acc, book) => acc + book.score, 0);

    const bBookSum = b.books
      .reduce((acc, book) => acc + book.score, 0);
  
    const aScore = aBookSum / aTotalBooks;
    const bScore = bBookSum / bTotalBooks;
  
    if (bScore > aScore) {
      return 1;
    }
    else {
      return -1;
    } 
  });

  return newLibraries;
}

const randomizeLibrary = (parsed, daysCount, libraries, iterations, random) => {
  let maxPoints = 0;
  let result;
  for (let i = 0; i < 50; i++) {
    if (i % 10 === 0) {
      console.log(i);
    }
    const selectedLibraries = [];
    const excludedLibraries = [];
    const betterLibraries = getBetterLibraries(daysCount, libraries);
    betterLibraries.forEach((library) => {
      if (Math.random() > random) {
        selectedLibraries.push(library)
      }
      else {
        excludedLibraries.push(library);
      }
    });

    const newDaysCount = daysCount - selectedLibraries.reduce((acc, l) => acc + l.signupDays, 0);
    const newBetterLibraries = getBetterLibraries(newDaysCount, excludedLibraries);
    newBetterLibraries.forEach((library) => {
      selectedLibraries.push(library);
    });

    const { points } = compute(parsed, { libraries: selectedLibraries });
    if (points > maxPoints) {
      console.log('better');
      maxPoints = points;
      result = selectedLibraries;
    }
  }

  return result;
}

const solve = (parsed) => {
  const { 
      books,
      daysCount,
      libraries,
  } = parsed;

  return {
    libraries: randomizeLibrary(parsed, daysCount, libraries, 1, 0), 
  };
}

module.exports = solve;