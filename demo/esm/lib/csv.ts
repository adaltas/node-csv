
// Import the package main module
import * as csv from 'csv'

// Generate 20 records
const generator: csv.generator.Generator = csv.generate({
  delimiter: '|',
  length: 20
})
// Transform CSV data into records
const parser: csv.parser.Parser = csv.parse({
  delimiter: '|'
})
// Transform each value into uppercase
const transformer: csv.transformer.Transformer = csv.transform((record) => {
   return record.map((value: string) => {
     return value.toUpperCase()
   });
})
// Convert objects into a stream
const stringifier: csv.stringifier.Stringifier = csv.stringify({
  cast: {
    string: (value: string, context: csv.stringifier.CastingContext) => {
      return context.index % 2 ? value.toLowerCase() : value.toUpperCase();
    }
  },
  quoted: true,
})

// Run the pipeline
generator
.pipe(parser)
.pipe(transformer)
.pipe(stringifier)
.pipe(process.stdout)
