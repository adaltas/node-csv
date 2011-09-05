
// Test CSV - Copyright David Worms <open@adaltas.com> (MIT Licensed)

var fs = require('fs'),
    assert = require('assert'),
    csv = require('csv');

module.exports = {
    'Test line breaks custom': function(){
        csv()
        .fromPath(__dirname+'/lineBreaks/lineBreaks.in',{
        })
        .toPath(__dirname+'/lineBreaks/custom.tmp',{
            lineBreaks: "::"
        })
        .on('end',function(count){
            assert.strictEqual(2,count);
            assert.equal(
                fs.readFileSync(__dirname+'/lineBreaks/custom.out').toString(),
                fs.readFileSync(__dirname+'/lineBreaks/custom.tmp').toString()
            );
            fs.unlink(__dirname+'/lineBreaks/custom.tmp');
        });
    },
    'Test line breaks unix': function(){
        csv()
        .fromPath(__dirname+'/lineBreaks/lineBreaks.in',{
        })
        .toPath(__dirname+'/lineBreaks/unix.tmp',{
            lineBreaks: "unix"
        })
        .on('end',function(count){
            assert.strictEqual(2,count);
            assert.equal(
                fs.readFileSync(__dirname+'/lineBreaks/unix.out').toString(),
                fs.readFileSync(__dirname+'/lineBreaks/unix.tmp').toString()
            );
            fs.unlink(__dirname+'/lineBreaks/unix.tmp');
        });
    },
    'Test line breaks unicode': function(){
        csv()
        .fromPath(__dirname+'/lineBreaks/lineBreaks.in',{
        })
        .toPath(__dirname+'/lineBreaks/unicode.tmp',{
            lineBreaks: "unicode"
        })
        .on('end',function(count){
            assert.strictEqual(2,count);
            assert.equal(
                fs.readFileSync(__dirname+'/lineBreaks/unicode.out').toString(),
                fs.readFileSync(__dirname+'/lineBreaks/unicode.tmp').toString()
            );
            fs.unlink(__dirname+'/lineBreaks/unicode.tmp');
        });
    },
    'Test line breaks mac': function(){
        csv()
        .fromPath(__dirname+'/lineBreaks/lineBreaks.in',{
        })
        .toPath(__dirname+'/lineBreaks/mac.tmp',{
            lineBreaks: "mac"
        })
        .on('end',function(count){
            assert.strictEqual(2,count);
            assert.equal(
                fs.readFileSync(__dirname+'/lineBreaks/mac.out').toString(),
                fs.readFileSync(__dirname+'/lineBreaks/mac.tmp').toString()
            );
            fs.unlink(__dirname+'/lineBreaks/mac.tmp');
        });
    },
    'Test line breaks windows': function(){
        csv()
        .fromPath(__dirname+'/lineBreaks/lineBreaks.in',{
        })
        .toPath(__dirname+'/lineBreaks/windows.tmp',{
            lineBreaks: "windows"
        })
        .on('end',function(count){
            assert.strictEqual(2,count);
            assert.equal(
                fs.readFileSync(__dirname+'/lineBreaks/windows.out').toString(),
                fs.readFileSync(__dirname+'/lineBreaks/windows.tmp').toString()
            );
            fs.unlink(__dirname+'/lineBreaks/windows.tmp');
        });
    }
}