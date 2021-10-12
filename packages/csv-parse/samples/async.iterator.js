
import assert from 'assert'
import { generate } from 'csv-generate'
import { parse } from 'csv-parse'

(async () => {
  // Initialise the parser by generating random records
  const parser = generate({
    high_water_mark: 64 * 64,
    length: 100
  }).pipe(
    parse()
  )
  // Intialise count
  let count = 0;
  // Report start
  process.stdout.write('start\n')
  // Iterate through each records
  for await (const record of parser) {
    // Report current line
    process.stdout.write(`${count++} ${record.join(',')}\n`)
    // Fake asynchronous operation
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  // Report end
  process.stdout.write('...done\n')
  // Validation
  assert.strictEqual(count, 100)
})()
