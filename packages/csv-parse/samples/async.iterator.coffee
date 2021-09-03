
import assert from 'assert'
import generate from 'csv-generate'
import parse from '../lib/index.js'

(() ->
  # Initialise the parser by generating random records
  parser = generate(
    high_water_mark: 64 * 64
    length: 1000
  ).pipe parse()
  # Intialise count
  count = 0
  # Report start
  process.stdout.write 'start\n'
  # Iterate through each records
  for await record from parser
    # Report current line
    process.stdout.write "#{count++} #{record.join(',')}\n"
    # Fake asynchronous operation
    await new Promise (resolve) -> setTimeout resolve, 1000
  # Report end
  process.stdout.write '...done\n'
  # Validation
  assert.strictEqual count, 10000
)()
