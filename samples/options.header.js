
// Output looks like:
// birthYear,phone
// OMH,ONKCHhJmjadoA

const stringify = require('../lib')
const generate = require('csv-generate')
const generator = generate({
  objectMode: true,
  seed: 1,
  headers: 2
})
const stringifier = stringify({
  header: true,
  columns: {
   year: 'birthYear',
   phone: 'phone'
  }
})
generator.pipe(stringifier).pipe(process.stdout)
