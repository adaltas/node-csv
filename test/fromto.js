
// Test CSV - Copyright David Worms <open@adaltas.com> (MIT Licensed)

var fs = require('fs'),
	csv = require('csv');


module.exports = {
	'Test fs stream': function(assert){
		csv()
		.fromStream(fs.createReadStream(__dirname+'/fromto/sample.in',{flags:'r'}))
		.toStream(fs.createWriteStream(__dirname+'/fromto/sample.tmp',{flags:'w'}))
		.on('end',function(count){
			assert.strictEqual(2,count);
			assert.equal(
				fs.readFileSync(__dirname+'/fromto/sample.out').toString(),
				fs.readFileSync(__dirname+'/fromto/sample.tmp').toString()
			);
			fs.unlink(__dirname+'/fromto/sample.tmp');
		});
	},
	'Test string without destination': function(assert){
		csv()
		.from(fs.readFileSync(__dirname+'/fromto/sample.in').toString())
		.on('data',function(data,index){
			assert.ok(index<2);
			if(index===0){
				assert.strictEqual('20322051544',data[0])
			}else if(index===1){
				assert.strictEqual('28392898392',data[0])
			}
		})
		.on('end',function(count){
			assert.strictEqual(2,count);
		});
	},
	'Test string to stream': function(assert){
		csv()
		.from(fs.readFileSync(__dirname+'/fromto/string_to_stream.in').toString())
		.toPath(__dirname+'/fromto/string_to_stream.tmp')
		.on('data',function(data,index){
			console.log("ON DATA");
			assert.ok(index<2);
			if(index===0){
				assert.strictEqual('20322051544',data[0])
			}else if(index===1){
				assert.strictEqual('28392898392',data[0])
			}
		})
		.on('end',function(count){
			assert.strictEqual(2,count);
			assert.equal(
				fs.readFileSync(__dirname+'/fromto/string_to_stream.out').toString(),
				fs.readFileSync(__dirname+'/fromto/string_to_stream.tmp').toString()
			);
			fs.unlink(__dirname+'/fromto/string_to_stream.tmp');
		});
	}
}