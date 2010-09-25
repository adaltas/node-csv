
// CSV sample - Copyright David Worms <open@adaltas.com> (MIT Licensed)

	// node sample/sample.js
	var csv = require('csv');
	
	csv()
	.fromPath(__dirname+'/sample.in')
	.toPath(__dirname+'/sample.out')
	.transform(function(data){
		data.unshift(data.pop());
		return data;
	})
	.on('data',function(data,index){
		console.log('#'+index+' '+JSON.stringify(data));
	})
	.on('end',function(count){
		console.log('Number of lines '+count);
	})
	.on('error',function(error){
		console.log(error.message);
	});