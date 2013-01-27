
csv = require('..');

// Parse a CSV text to an array
csv()
.from.string( '"1","2","3","4"\n"a","b","c","d"' )
.to.array( function(rows){
  console.log(rows);
  // Stringify array to a CSV text
  csv()
  .from.array( rows )
  .to.string( function(text){
    console.log(text);
  } );
} );

