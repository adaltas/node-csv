
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
	'Test quotes with separator': function(assert){
		csv()
		.fromPath(__dirname+'/quotes/separator.in',{
		})
		.toPath(__dirname+'/quotes/separator.tmp',{
		})
		.on('end',function(){
			assert.equal(
				fs.readFileSync(__dirname+'/quotes/separator.out').toString(),
				fs.readFileSync(__dirname+'/quotes/separator.tmp').toString()
			);
			fs.unlink(__dirname+'/quotes/separator.tmp');
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