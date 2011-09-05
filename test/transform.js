
// Test CSV - Copyright David Worms <open@adaltas.com> (MIT Licensed)

var fs = require('fs'),
    assert = require('assert'),
    csv = require('csv');

module.exports = {
    'Test reorder fields': function(){
        var count = 0;
        csv()
        .fromPath(__dirname+'/transform/reorder.in')
        .toPath(__dirname+'/transform/reorder.tmp')
        .transform(function(data,index){
            assert.strictEqual(count,index);
            count++;
            data.unshift(data.pop());
            return data;
        })
        .on('end',function(){
            assert.strictEqual(2,count);
            assert.equal(
                fs.readFileSync(__dirname+'/transform/reorder.out').toString(),
                fs.readFileSync(__dirname+'/transform/reorder.tmp').toString()
            );
            fs.unlink(__dirname+'/transform/reorder.tmp');
        });
    },
    'Test return undefined - skip all lines': function(){
        var count = 0;
        csv()
        .fromPath(__dirname+'/transform/undefined.in')
        .toPath(__dirname+'/transform/undefined.tmp')
        .transform(function(data,index){
            assert.strictEqual(count,index);
            count++;
        })
        .on('end',function(){
            assert.strictEqual(2,count);
            assert.equal(
                fs.readFileSync(__dirname+'/transform/undefined.out').toString(),
                fs.readFileSync(__dirname+'/transform/undefined.tmp').toString()
            );
            fs.unlink(__dirname+'/transform/undefined.tmp');
        });
    },
    'Test return null - skip one of two lines': function(){
        var count = 0;
        csv()
        .fromPath(__dirname+'/transform/null.in')
        .toPath(__dirname+'/transform/null.tmp')
        .transform(function(data,index){
            assert.strictEqual(count,index);
            count++;
            return index%2 ? data : null;
        })
        .on('end',function(){
            assert.strictEqual(6,count);
            assert.equal(
                fs.readFileSync(__dirname+'/transform/null.out').toString(),
                fs.readFileSync(__dirname+'/transform/null.tmp').toString()
            );
            fs.unlink(__dirname+'/transform/null.tmp');
        });
    },
    'Test return object': function(){
        // we don't define columns
        // recieve and array and return an object
        // also see the columns test
        csv()
        .fromPath(__dirname+'/transform/object.in')
        .toPath(__dirname+'/transform/object.tmp')
        .transform(function(data,index){
            return {field_1:data[4],field_2:data[3]};
        })
        .on('end',function(count){
            assert.strictEqual(2,count);
            assert.equal(
                fs.readFileSync(__dirname+'/transform/object.out').toString(),
                fs.readFileSync(__dirname+'/transform/object.tmp').toString()
            );
            fs.unlink(__dirname+'/transform/object.tmp');
        });
    },
    'Test return string': function(){
        csv()
        .fromPath(__dirname+'/transform/string.in')
        .toPath(__dirname+'/transform/string.tmp')
        .transform(function(data,index){
            return (index>0 ? ',' : '') + data[4] + ":" + data[3];
        })
        .on('end',function(count){
            assert.strictEqual(2,count);
            assert.equal(
                fs.readFileSync(__dirname+'/transform/string.out').toString(),
                fs.readFileSync(__dirname+'/transform/string.tmp').toString()
            );
            fs.unlink(__dirname+'/transform/string.tmp');
        });
    },
    'Test types': function(){
        // Test date, int and float
        csv()
        .fromPath(__dirname+'/transform/types.in')
        .toPath(__dirname+'/transform/types.tmp')
        .transform(function(data,index){
            data[3] = data[3].split('-');
            return [parseInt(data[0]),parseFloat(data[1]),parseFloat(data[2]),Date.UTC(data[3][0],data[3][1],data[3][2])];
        })
        .on('end',function(count){
            assert.strictEqual(2,count);
            assert.equal(
                fs.readFileSync(__dirname+'/transform/types.out').toString(),
                fs.readFileSync(__dirname+'/transform/types.tmp').toString()
            );
            fs.unlink(__dirname+'/transform/types.tmp');
        });
    }
}