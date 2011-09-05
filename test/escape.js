
// Test CSV - Copyright David Worms <open@adaltas.com> (MIT Licensed)

var fs = require('fs'),
    assert = require('assert'),
    csv = require('csv');

module.exports = {
    // Note: we only escape quote and escape character
    'Test default': function(){
        csv()
        .fromPath(__dirname+'/escape/default.in',{
            escape: '"'
        })
        .toPath(__dirname+'/escape/default.tmp')
        .on('data',function(data,index){
            if(index===0){
                assert.equal('19"79.0',data[1]);
                assert.equal('A"B"C',data[3]);
            }
        })
        .on('end',function(){
            assert.equal(
                fs.readFileSync(__dirname+'/escape/default.out').toString(),
                fs.readFileSync(__dirname+'/escape/default.tmp').toString()
            );
            fs.unlink(__dirname+'/escape/default.tmp');
        });
    },
    'Test backslash': function(){
        csv()
        .fromPath(__dirname+'/escape/backslash.in',{
            escape: '\\'
        })
        .toPath(__dirname+'/escape/backslash.tmp')
        .on('data',function(data,index){
            if(index===0){
                assert.equal('19"79.0',data[1]);
                assert.equal('A"B"C',data[3]);
            }
        })
        .on('end',function(count){
            assert.strictEqual(2,count);
            assert.equal(
                fs.readFileSync(__dirname+'/escape/backslash.out').toString(),
                fs.readFileSync(__dirname+'/escape/backslash.tmp').toString()
            );
            fs.unlink(__dirname+'/escape/backslash.tmp');
        });
    }
}