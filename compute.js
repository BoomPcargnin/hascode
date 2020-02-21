const compute = (parsed, result) => {
    const bookUsedIds = [];
    const { daysCount, books } = parsed;
    let tmpDaysCount = daysCount;
    const { libraries } = result;
    let points = 0;
    libraries.forEach((library) => {
      const daysForLibrary = tmpDaysCount - library.signupDays;
      tmpDaysCount = daysForLibrary;
      const booksForLibrary = daysForLibrary * library.booksPerDay;
      const booksPoints = library.books.reduce((acc, book, index) => {
        if (index > booksForLibrary) {
          return acc;
        }
        if (!bookUsedIds.includes(book.id)) {
          bookUsedIds.push(book.id);
          acc = acc + book.score;
        }
        return acc;
      }, 0);
      points += booksPoints;
    });
    return points;
  }

  const computed1 = (parsed, result) => {
    const bookUsedIds = [];
    const { libraries } = result;
    const { daysCount } = parsed;
    let tmpDaysCount = daysCount;
    let points = 0;
    libraries.forEach((library) => {
      tmpDaysCount -= library.signupDays;
      const libraryDays = tmpDaysCount * library.booksPerDay;
      library.books.forEach((book, index) => {
        if (!bookUsedIds.includes(book.id) && index < libraryDays) {
          bookUsedIds.push(book.id);
          points += book.score;
        }
      })
    });
    return points;
  }

  module.exports = computed1;