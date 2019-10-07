
(async () => {
  const assert = require('assert')
  const parse = require('..')
  const generate = require('csv-generate')
  // Create a readable input stream, could be `fs.createReadStream`
  const input = generate({
    length: 10000
  })
  // Initialise the parser by generating random records
  const parser = input.pipe(parse())
  // Iterate through each records
  let count = 0
  for await (const record of parser) {
    count++
  }
  // Validation
  assert.strictEqual(count, 10000)
})();
