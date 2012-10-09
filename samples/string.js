
var csv = require('..');

csv()
.from( '"1","2","3","4"\n"a","b","c","d"' )
.to( console.log )

/*

`node samples/string.js`

1,2,3,4
a,b,c,d

*/