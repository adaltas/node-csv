
import assert from 'assert';
import { generate } from 'csv-generate';
import { stringify } from 'csv-stringify';

(async () => {
  // Initialise the parser by generating random records
  const stringifier = generate({
    length: 1000,
    objectMode: true,
    seed: true
  }).pipe(
    stringify()
  );
  // Intialise count
  let count = 0;
  // Report start
  process.stdout.write('start\n');
  // Iterate through each records
  for await (const row of stringifier) {
    // Report current line
    process.stdout.write(`${count++} ${row}\n`);
    // Fake asynchronous operation
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  // Report end
  process.stdout.write('...done\n');
  // Validation
  assert.strictEqual(count, 5);
})();
