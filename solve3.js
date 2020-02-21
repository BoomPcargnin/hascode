const compute = require('./compute');
const getBetterLibraries = (daysCount, libraries) => {
    const newLibraries = JSON.parse(JSON.stringify(libraries));
    
    newLibraries.sort((a, b) => {
      return  (a.signupDays * Math.random()) - (b.signupDays * Math.random());
    });
  
    return newLibraries;
  }
  
  const solve = (parsed) => {
    const { 
        books,
        daysCount,
        libraries,
    } = parsed;

    let maxPoints = 0;
    let realResult = null;
    for(let i = 0; i < 5; i += 1) {
      const result = getBetterLibraries(daysCount, libraries);
      const points = compute(parsed, { libraries: result });
      if (i % 10 === 0)  {
        console.log(i)
      }
      if (maxPoints < points) {
        console.log(points);
        maxPoints = points;
        realResult = result;
      }
    }
  
    return {
      libraries: realResult, 
    };
  }
  
  module.exports = solve;