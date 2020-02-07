
const assert = require('assert');
const generate = require('csv-generate');
const parse = require('..');

// Parameters
const wait = 100;
let count = 0;

(async () => {
  // Initialise the parser by generating random records
  const parser = generate({
    high_water_mark: 64 * 64,
    length: 1000
  }).pipe(
    parse()
  )
  // Report start
  process.stdout.write('start\n')
  // Iterate through each records
  for await (const record of parser) {
    count++
    // Report current line
    process.stdout.write(`${count} ${record.join(',')}\n`)
    // Fake asynchronous operation
    await write()
  }
  // Report end
  process.stdout.write('...done\n')
  // Validation
  assert.strictEqual(count, 10000)
})()
// A fake asynchronous write function
const write = function(){
  return new Promise((resolve) => setTimeout(function(){
    resolve()
  }, 100))
};
