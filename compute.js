  const compute = (parsed, result) => {
    const bookUsedIds = [];
    const { libraries } = result;
    const { daysCount, books } = parsed;
    const clonedBooks = JSON.parse(JSON.stringify(books));
    clonedBooks.sort((a, b) => b.score - a.score);
    const maxPoints = clonedBooks.reduce((acc, book, index) => {
      if (index < daysCount) {
        return acc + book.score;
      }
      return acc;
    }, 0);
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
    return { 
      points,
      maxPoints,
      error: maxPoints - points,
    };
  }

  module.exports = compute;