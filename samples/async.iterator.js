
const assert = require('assert')
const parse = require('..')
const generate = require('csv-generate')

const main = async function(){
  // Initialise the parser by generating random records
  const parser = generate({
    length: 10000
  })
  .pipe(parse())
  // Iterate through each records
  let count = 0
  for await (const record of parser) {
    count++
  }
  // Validation
  assert.strictEqual(count, 10000)
}
main()
