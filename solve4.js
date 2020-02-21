
let bookUsedIds = [];

const getBetterLibraries = (daysCount, libraries) => {
  const newLibraries = JSON.parse(JSON.stringify(libraries));
  
  newLibraries.sort((a, b) => {

    const aSignup = a.signupDays;
    const aBookPerDays = a.booksPerDay;

    const bSignup = a.signupDays;
    const bBookPerDays = a.booksPerDay;

    const aBookScore = a.books
      .filter((item, index) => { 
        return (
          index < (daysCount - aSignup) * aBookPerDays
          && !bookUsedIds.includes(item.id)
        ) 
      })
      .reduce((acc, book) => acc + book.score, 0);

    const bBookScore = b.books
      .filter((item, index) => { 
        return (
          index < (daysCount - bSignup) * bBookPerDays
          && !bookUsedIds.includes(item.id)
        ) 
      })
      .reduce((acc, book) => acc + book.score, 0);

    const aRealScore = aBookScore
    const bRealScore = bBookScore;

    return bRealScore - aRealScore;  
  });

  return newLibraries;
}

const recursiveSort = (daysCount, libraries, result) => {
  if (libraries.length > 0 && daysCount > 0) {
    const bestLibrary = getBetterLibraries(daysCount, libraries)[0];
    result.push(bestLibrary);
    const howManyBooks = (daysCount - bestLibrary.signupDays) * bestLibrary.booksPerDay;
    const libraryUsedBooks = bestLibrary.books.reduce((acc, item, index) => {
      if (index > howManyBooks) {
        acc.push(item);
      }
      return acc;
    }, []);
    bookUsedIds = [...bookUsedIds, ...libraryUsedBooks.map(kkk => kkk.id)];
    recursiveSort(daysCount - bestLibrary.signupDays, libraries.filter(l => l.id !== bestLibrary.id), result);
  }
  return result;
}

  const solve = (parsed) => {
    const { 
        books,
        daysCount,
        libraries,
    } = parsed;

    libraries.forEach((library) => {
      library.books.sort((kk, kk1) => kk1.score - kk.score);
    })
  
    return {
      libraries: recursiveSort(daysCount, libraries, []), 
    };
  }
  
  module.exports = solve;