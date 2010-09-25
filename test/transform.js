
// Test CSV - Copyright David Worms <open@adaltas.com> (MIT Licensed)

var fs = require('fs'),
	csv = require('csv');


module.exports = {
	'Test reorder fields': function(assert){
		var count = 0;
		csv()
		.fromPath(__dirname+'/transform/reorder.in')
		.toPath(__dirname+'/transform/reorder.tmp')
		.transform(function(data,index){
			assert.strictEqual(count,index);
			count++;
			data.unshift(data.pop());
			return data;
		})
		.on('end',function(){
			assert.strictEqual(2,count);
			assert.equal(
				fs.readFileSync(__dirname+'/transform/reorder.out').toString(),
				fs.readFileSync(__dirname+'/transform/reorder.tmp').toString()
			);
			fs.unlink(__dirname+'/transform/reorder.tmp');
		});
	},
	'Test empty': function(assert){
		var count = 0;
		csv()
		.fromPath(__dirname+'/transform/empty.in')
		.toPath(__dirname+'/transform/empty.tmp')
		.transform(function(data,index){
			assert.strictEqual(count,index);
			count++;
			return null;
		})
		.on('end',function(){
			assert.strictEqual(2,count);
			assert.equal(
				fs.readFileSync(__dirname+'/transform/empty.out').toString(),
				fs.readFileSync(__dirname+'/transform/empty.tmp').toString()
			);
			fs.unlink(__dirname+'/transform/empty.tmp');
		});
	}
}