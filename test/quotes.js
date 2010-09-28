
// Test CSV - Copyright David Worms <open@adaltas.com> (MIT Licensed)

var fs = require('fs'),
	csv = require('csv');

module.exports = {
	'Test regular quotes': function(assert){
		csv()
		.fromPath(__dirname+'/quotes/regular.in',{
		})
		.toPath(__dirname+'/quotes/regular.tmp',{
		})
		.on('end',function(){
			assert.equal(
				fs.readFileSync(__dirname+'/quotes/regular.out').toString(),
				fs.readFileSync(__dirname+'/quotes/regular.tmp').toString()
			);
			fs.unlink(__dirname+'/quotes/regular.tmp');
		});
	},
	'Test quotes with delimiter': function(assert){
		csv()
		.fromPath(__dirname+'/quotes/delimiter.in',{
		})
		.toPath(__dirname+'/quotes/delimiter.tmp',{
		})
		.on('end',function(){
			assert.equal(
				fs.readFileSync(__dirname+'/quotes/delimiter.out').toString(),
				fs.readFileSync(__dirname+'/quotes/delimiter.tmp').toString()
			);
			fs.unlink(__dirname+'/quotes/delimiter.tmp');
		});
	},
	'Test quotes inside field': function(assert){
		csv()
		.fromPath(__dirname+'/quotes/in_field.in',{
		})
		.toPath(__dirname+'/quotes/in_field.tmp',{
		})
		.on('end',function(){
			assert.equal(
				fs.readFileSync(__dirname+'/quotes/in_field.out').toString(),
				fs.readFileSync(__dirname+'/quotes/in_field.tmp').toString()
			);
			fs.unlink(__dirname+'/quotes/in_field.tmp');
		});
	},
	'Test empty value': function(assert){
		csv()
		.fromPath(__dirname+'/quotes/empty_value.in',{
			quote: '"',
			escape: '"',
		})
		.toPath(__dirname+'/quotes/empty_value.tmp')
		.on('end',function(){
			assert.equal(
				fs.readFileSync(__dirname+'/quotes/empty_value.out').toString(),
				fs.readFileSync(__dirname+'/quotes/empty_value.tmp').toString()
			);
			fs.unlink(__dirname+'/quotes/empty_value.tmp');
		});
	},
	'Test quoted quote': function(assert){
		csv()
		.fromPath(__dirname+'/quotes/quoted.in',{
			quote: '"',
			escape: '"',
		})
		.toPath(__dirname+'/quotes/quoted.tmp')
		.on('data',function(data,index){
			assert.strictEqual(5,data.length);
			if(index===0){
				assert.strictEqual('"',data[1]);
				assert.strictEqual('"ok"',data[4]);
			}
		})
		.on('end',function(){
			assert.equal(
				fs.readFileSync(__dirname+'/quotes/quoted.out').toString(),
				fs.readFileSync(__dirname+'/quotes/quoted.tmp').toString()
			);
			fs.unlink(__dirname+'/quotes/quoted.tmp');
		});
	}
}