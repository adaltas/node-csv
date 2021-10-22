
// Import the package main module
import * as csv from '../lib/index.js';
// Use the module
csv.generate ({seed: 1, length: 20}).pipe(
  csv.parse ()).pipe(
  csv.transform (function(record){
    return record.map(function(value){
      return value.toUpperCase();
    });})).pipe(
  csv.stringify ()).pipe(process.stdout);
