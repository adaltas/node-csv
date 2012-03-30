
// Test CSV - Copyright David Worms <open@adaltas.com> (MIT Licensed)

var fs = require('fs'),
    assert = require('assert'),
    csv = require('..'),
    Stream = require('stream').Stream,
    util = require('util');
    
function TestStream() {
    Stream.call(this);
    this.writable = true;
}

util.inherits(TestStream, Stream);

TestStream.prototype.end = function() {
    this.emit('end');
};

TestStream.prototype.write = function(item) {
    this.emit('data', item);
};

module.exports = {
    'Test fs stream': function(){
        var itemCount = 0;
        
        csv()
        .fromStream(fs.createReadStream(__dirname+'/pipe/sample.in',{flags:'r'}))
        .pipe(new TestStream())
        .on('data', function(item) {
            itemCount++;
        })
        .on('end',function(){
            assert.strictEqual(2,itemCount);
        });
    }
};