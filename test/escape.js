
// Test CSV - Copyright David Worms <open@adaltas.com> (MIT Licensed)

var fs = require('fs'),
	csv = require('csv');


module.exports = {
	// Note: we only escape quote and escape character
	'Test default': function(assert){
		csv()
		.fromPath(__dirname+'/escape/default.in')
		.toPath(__dirname+'/escape/default.tmp')
		.on('end',function(){
			assert.equal(
				fs.readFileSync(__dirname+'/escape/default.out').toString(),
				fs.readFileSync(__dirname+'/escape/default.tmp').toString()
			);
			fs.unlink(__dirname+'/escape/default.tmp');
		});
	},
	'Test backslash': function(assert){
		csv()
		.fromPath(__dirname+'/escape/custom.in',{
			escape: '\\'
		})
		.toPath(__dirname+'/escape/custom.tmp')
		.on('end',function(){
			assert.equal(
				fs.readFileSync(__dirname+'/escape/custom.out').toString(),
				fs.readFileSync(__dirname+'/escape/custom.tmp').toString()
			);
			fs.unlink(__dirname+'/escape/custom.tmp');
		});
	}
}