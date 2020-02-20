const fs = require('fs');
const path = require('path');

const solve1 = require('./solve1');
const solve2 = require('./solve2');

const parse = (inputFile) => {
  const fileContent = fs.readFileSync(path.join(__dirname, 'inputs', inputFile), 'utf8');
  const [firstLine, secondLine, ...rest] = fileContent.split('\n');
  const [_booksCount, _librariesCount, daysCount] = firstLine.split(' ').map(k => parseInt(k, 10));
  const books = secondLine.split(' ').map((k, index) => ({
    id: index,
    score: parseInt(k),
  }));
  const libraries = rest.filter(k => k !== '').reduce((acc, item, index, array) => {
    if (index % 2 === 1) {
      const id = parseInt(index / 2)
      const first = array[index - 1];
      const second = array[index];
      const [libraryBookCount, signupDays, booksPerDay] = first.split(' ').map(k => parseInt(k));
      const bookIds = second.split(' ').map(k => parseInt(k));
      acc.push({
        id,
        booksCount: libraryBookCount,
        signupDays,
        booksPerDay,
        books: bookIds.map(a => ({
          id: parseInt(a),
          score: books[a].score,
        })),
      });
    }

    return acc;
  }, []);

  return {
    books,
    daysCount,
    libraries,
  };
}

const solve = (parsed) => {
  return solve2(parsed);
};

const output = (inputFile, solved) => {
  const {
    libraries,
  } = solved;

  const firstLine = libraries.length.toString();
  const otherLines = libraries.map((library) => `${library.id} ${library.books.length}\n${library.books.map(b => b.id).join(' ')}`).join('\n');
  const text = `${firstLine}\n${otherLines}`;
  fs.writeFileSync(path.join(__dirname, 'outputs', `${inputFile}.out`), text, 'utf8');
};


const run = (inputFile) => {
  const parsed = parse(inputFile);
  const solved = solve(parsed);
  output(inputFile, solved);
};

const inputFiles = [
  'a_example.txt',
  'b_read_on.txt',
  'c_incunabula.txt',
  'd_tough_choices.txt',
  'e_so_many_books.txt',
  'f_libraries_of_the_world.txt',
]

inputFiles.map((inputFile) => {
  console.log(`Start: ${inputFile}`)
  run(inputFile);
  console.log(`End: ${inputFile}`)
})