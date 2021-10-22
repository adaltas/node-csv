
// Import the package main module
import * as csv from '../lib/index.js';

// Run the pipeline
csv
// Generate 20 records
  .generate({
    delimiter: '|',
    length: 20
  })
// Transform CSV data into records
  .pipe(csv.parse({
    delimiter: '|'
  }))
// Transform each value into uppercase
  .pipe(csv.transform((record) => {
    return record.map((value) => {
      return value.toUpperCase();
    });
  }))
// Convert objects into a stream
  .pipe(csv.stringify({
    quoted: true
  }))
// Print the CSV stream to stdout
  .pipe(process.stdout);
