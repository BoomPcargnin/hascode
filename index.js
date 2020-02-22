const fs = require('fs');
const path = require('path');
const compute  =  require('./compute')

const solve1 = require('./solve1');
const solve2 = require('./solve2');
const solve3 = require('./solve3');
const solve4 = require('./solve4');
const solve5 = require('./solve5');
const solve6 = require('./solve6');

const abSolve1 = require('./ab/solve1');
const abSolve2 = require('./ab/solve2');
const abSolve3 = require('./ab/solve3');
const abSolve4 = require('./ab/solve4');

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

  const booksArray = books.map((b) => b.score);
  booksArray.sort((a, b) => b - a);
  const ipoteticalMaxPoints = booksArray.reduce((acc, i) => acc + i);
  console.log(`Ipotetical MaxPoints: ${ipoteticalMaxPoints}`)

  return {
    books,
    daysCount,
    libraries,
  };
}

const solve = (parsed) => {
  return abSolve4(parsed);
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
  const result = compute(parsed,solved);
  output(inputFile, solved);
  return result;
};

const inputFiles = [
  'a_example.txt',
  'b_read_on.txt',
  'c_incunabula.txt',
  'd_tough_choices.txt',
  'e_so_many_books.txt',
  'f_libraries_of_the_world.txt',
]


const endResult = inputFiles.map((inputFile) => {
  console.log(`Start: ${inputFile}`)
  const result = run(inputFile);
  const { points, error, percent } = result;
  console.log(`End: ${inputFile}. Points: ${points} (error: ${error} [${percent.toFixed(2)}%])`)
  return result;
})


console.log('TOTAL points')
console.log(endResult.reduce((acc, i) => {
  return acc + i.points
}, 0));