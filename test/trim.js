
// Test CSV - Copyright David Worms <open@adaltas.com> (MIT Licensed)

var fs = require('fs'),
    assert = require('assert'),
    csv = require('csv');

module.exports = {
    'Test ignoring whitespace immediately following the delimiter': function(){
        csv()
        .fromPath(__dirname+'/trim/ltrim.in', {ltrim: true})
        .toPath(__dirname+'/trim/ltrim.tmp')
        .transform(function(data,index){
            return data;
        })
        .on('end',function(count){
            assert.strictEqual(3,count);
            // console.log('');
            // console.log(fs.readFileSync(__dirname+'/trim/ltrim.tmp').toString());
            // console.log('');
            // console.log(fs.readFileSync(__dirname+'/trim/ltrim.out').toString());
            assert.equal(
                fs.readFileSync(__dirname+'/trim/ltrim.out').toString(),
                fs.readFileSync(__dirname+'/trim/ltrim.tmp').toString()
            );
            fs.unlink(__dirname+'/trim/ltrim.tmp');
        });
    },
    'Test rtrim - ignoring whitespace immediately preceding the delimiter': function(){
        csv()
        .fromPath(__dirname+'/trim/rtrim.in', {rtrim: true})
        .toPath(__dirname+'/trim/rtrim.tmp')
        .transform(function(data,index){
            return data;
        })
        .on('end',function(count){
            assert.strictEqual(3,count);
            assert.equal(
                fs.readFileSync(__dirname+'/trim/rtrim.out').toString(),
                fs.readFileSync(__dirname+'/trim/rtrim.tmp').toString()
            );
            fs.unlink(__dirname+'/trim/rtrim.tmp');
        });
    },
    'Test trim - ignoring whitespace both immediately preceding and following the delimiter': function(){
        csv()
        .fromPath(__dirname+'/trim/trim.in', {trim: true})
        .toPath(__dirname+'/trim/trim.tmp')
        .transform(function(data,index){
            return data;
        })
        .on('end',function(count){
            assert.strictEqual(3,count);
            assert.equal(
                fs.readFileSync(__dirname+'/trim/trim.out').toString(),
                fs.readFileSync(__dirname+'/trim/trim.tmp').toString()
            );
            fs.unlink(__dirname+'/trim/trim.tmp');
        });
    },
    'Test no trim': function(){
        csv()
        .fromPath(__dirname+'/trim/notrim.in')
        .toPath(__dirname+'/trim/notrim.tmp')
        .transform(function(data,index){
            return data;
        })
        .on('end',function(count){
            assert.strictEqual(3,count);
            assert.equal(
                fs.readFileSync(__dirname+'/trim/notrim.out').toString(),
                fs.readFileSync(__dirname+'/trim/notrim.tmp').toString()
            );
            fs.unlink(__dirname+'/trim/notrim.tmp');
        });
    }
}
