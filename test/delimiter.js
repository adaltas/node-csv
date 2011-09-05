
// Test CSV - Copyright David Worms <open@adaltas.com> (MIT Licensed)

var fs = require('fs'),
    assert = require('assert'),
    csv = require('csv');

module.exports = {
    'Test empty value': function(){
        csv()
        .fromPath(__dirname+'/delimiter/empty_value.in')
        .toPath(__dirname+'/delimiter/empty_value.tmp')
        .transform(function(data,index){
            assert.strictEqual(5,data.length);
            if(index===0){
                assert.strictEqual('',data[1]);
                assert.strictEqual('',data[4]);
            }else if(index===1){
                assert.strictEqual('',data[0]);
                assert.strictEqual('',data[3]);
                assert.strictEqual('',data[4]);
            }
            return data;
        })
        .on('end',function(count){
            assert.strictEqual(2,count);
            assert.equal(
                fs.readFileSync(__dirname+'/delimiter/empty_value.out').toString(),
                fs.readFileSync(__dirname+'/delimiter/empty_value.tmp').toString()
            );
            fs.unlink(__dirname+'/delimiter/empty_value.tmp');
        });
    }
}
