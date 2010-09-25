
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
	}
}