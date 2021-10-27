
// Import the package
import {generate, parse, transform, stringify} from 'csv';

/* hide-next-line */
/* eslint-disable indent */
// Run the pipeline
generate ({seed: 1, length: 20}).pipe(
parse ()).pipe(
transform (function(record){
                return record.map(function(value){
                  return value.toUpperCase();
              });})).pipe(
stringify ()).pipe(process.stdout);
