
csv = require('..');

csv()
.from.string( "1	2	3\ra	b	c", {delimiter: '\t'})
.to.array( function(data){
	console.log( JSON.stringify( data ) );
});
