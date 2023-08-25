
import assert from 'assert'
import { stringify, Stringifier } from 'csv-stringify';

// Create the parser
const output: string[] = [];
const stringifier: Stringifier = stringify({
  header: true,
  cast: {
    boolean: (value, ctx) => {
      if (ctx.header) return String(value)
      if (ctx.column === 'Removed' && value === false) {
        return '0'
      }
      return String(value)
    }
  }
});
// Write data to the stream
stringifier.write({a: 1, b: 2, c: 3});
// Close the readable stream
stringifier.end();
// Read output
stringifier.on('data', (buf) => {
  output.push(buf.toString());
})
stringifier.on('end', () => {
  console.log(output);
  assert(output.join(), 'a,b,c\n1,2,3\n')
})
