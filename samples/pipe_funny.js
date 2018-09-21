
// Import the package main module
const csv = require('..')
// Use the module
csv.generate  ({seed: 1, length: 20}).pipe(
csv.parse     ()).pipe(
csv.transform (function(record){
                return record.map(function(value){
                  return value.toUpperCase()
              })})).pipe(
csv.stringify ()).pipe(process.stdout)
