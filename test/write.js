
// Test CSV - Copyright David Worms <open@adaltas.com> (MIT Licensed)

var fs = require('fs'),
	assert = require('assert'),
	csv = require('csv');

module.exports = {
	'Test write array': function(){
		var count = 0;
		var test = csv()
		.toPath(__dirname+'/write/write_array.tmp')
		.on('data', function(data, index){
			assert.ok(Array.isArray(data));
			assert.eql(count,index);
			count++;
		})
		.on('end',function(){
			assert.eql(1000,count);
			assert.equal(
				fs.readFileSync(__dirname+'/write/write.out').toString(),
				fs.readFileSync(__dirname+'/write/write_array.tmp').toString()
			);
			fs.unlink(__dirname+'/write/write_array.tmp');
		});
		for(var i=0; i<1000; i++){
			test.write(['Test '+i,i,'"']);
		}
		test.end();
	},
	'Test write object with column options': function(){
		var count = 0;
		var test = csv()
		.toPath(__dirname+'/write/write_object.tmp',{
			columns: ['name','value','escape']
		})
		.on('data', function(data, index){
			assert.ok(typeof data === 'object');
			assert.ok(!Array.isArray(data));
			assert.eql(count,index);
			count++;
		})
		.on('end',function(){
			assert.eql(1000,count);
			assert.equal(
				fs.readFileSync(__dirname+'/write/write.out').toString(),
				fs.readFileSync(__dirname+'/write/write_object.tmp').toString()
			);
			fs.unlink(__dirname+'/write/write_object.tmp');
		});
		for(var i=0; i<1000; i++){
			test.write({name: 'Test '+i, value:i, escape: '"', ovni: 'ET '+i});
		}
		test.end();
	},
	'Test write string': function(){
		var count = 0;
		var test = csv()
		.toPath(__dirname+'/write/write_string.tmp')
		.on('data', function(data, index){
			assert.ok(Array.isArray(data));
			assert.eql(count,index);
			count++;
		})
		.on('end',function(){
			assert.eql(1000,count);
			assert.equal(
				fs.readFileSync(__dirname+'/write/write.out').toString(),
				fs.readFileSync(__dirname+'/write/write_string.tmp').toString()
			);
			fs.unlink(__dirname+'/write/write_string.tmp');
		});
		var buffer = '';
		for(var i=0; i<1000; i++){
			buffer += ''.concat('Test '+i,',',i,',','""""',"\r");
			if(buffer.length > 250){
				test.write(buffer.substr(0,250));
				buffer = buffer.substr(250);
			}
		}
		test.write(buffer);
		test.end();
	}
}