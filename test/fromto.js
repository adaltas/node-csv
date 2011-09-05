
// Test CSV - Copyright David Worms <open@adaltas.com> (MIT Licensed)

var fs = require('fs'),
    assert = require('assert'),
    csv = require('csv');

module.exports = {
    'Test fs stream': function(){
        csv()
        .fromStream(fs.createReadStream(__dirname+'/fromto/sample.in',{flags:'r'}))
        .toStream(fs.createWriteStream(__dirname+'/fromto/sample.tmp',{flags:'w'}))
        .on('end',function(count){
            assert.strictEqual(2,count);
            assert.equal(
                fs.readFileSync(__dirname+'/fromto/sample.out').toString(),
                fs.readFileSync(__dirname+'/fromto/sample.tmp').toString()
            );
            fs.unlink(__dirname+'/fromto/sample.tmp');
        });
    },
    'Test string without destination': function(){
        csv()
        .from(fs.readFileSync(__dirname+'/fromto/sample.in').toString())
        .on('data',function(data,index){
            assert.ok(index<2);
            if(index===0){
                assert.strictEqual('20322051544',data[0])
            }else if(index===1){
                assert.strictEqual('28392898392',data[0])
            }
        })
        .on('end',function(count){
            assert.strictEqual(2,count);
        });
    },
    'Test string to stream': function(){
        csv()
        .from(fs.readFileSync(__dirname+'/fromto/string_to_stream.in').toString())
        .toPath(__dirname+'/fromto/string_to_stream.tmp')
        .on('data',function(data,index){
            assert.ok(index<2);
            if(index===0){
                assert.strictEqual('20322051544',data[0])
            }else if(index===1){
                assert.strictEqual('28392898392',data[0])
            }
        })
        .on('end',function(count){
            assert.strictEqual(2,count);
            assert.equal(
                fs.readFileSync(__dirname+'/fromto/string_to_stream.out').toString(),
                fs.readFileSync(__dirname+'/fromto/string_to_stream.tmp').toString()
            );
            fs.unlink(__dirname+'/fromto/string_to_stream.tmp');
        });
    },
    'Test array to stream': function(){
        // note: destination line breaks is windows styled because we can't guess it
        var data = [
            ["20322051544","1979.0","8.8017226E7","ABC","45","2000-01-01"],
            ["28392898392","1974.0","8.8392926E7","DEF","23","2050-11-27"]
        ];
        csv()
        .from(data)
        .toPath(__dirname+'/fromto/array_to_stream.tmp')
        .on('data',function(data,index){
            assert.ok(index<2);
            if(index===0){
                assert.strictEqual('20322051544',data[0]);
            }else if(index===1){
                assert.strictEqual('28392898392',data[0]);
            }
        })
        .on('end',function(count){
            assert.strictEqual(2,count);
            assert.equal(
                fs.readFileSync(__dirname+'/fromto/array_to_stream.out').toString(),
                fs.readFileSync(__dirname+'/fromto/array_to_stream.tmp').toString()
            );
            fs.unlink(__dirname+'/fromto/array_to_stream.tmp');
        });
    },
    'Test null': function(){
        // note: destination line breaks is windows styled because we can't guess it
        var data = [
            ["20322051544",null,"8.8017226E7","ABC","45","2000-01-01"],
            ["28392898392","1974.0","8.8392926E7","DEF","23",null]
        ];
        csv()
        .from(data)
        .transform(function(data){
            data[0] = null;
            data[3] = null;
            return data;
        })
        .toPath(__dirname+'/fromto/null.tmp')
        .on('data',function(data,index){
            assert.ok(index<2);
            assert.strictEqual(null,data[0]);
            assert.strictEqual(null,data[3]);
            if(index===0){
                assert.strictEqual(null,data[1]);
            }else if(index===1){
                assert.strictEqual(null,data[5]);
            }
        })
        .on('end',function(count){
            assert.strictEqual(2,count);
            assert.equal(
                fs.readFileSync(__dirname+'/fromto/null.out').toString(),
                fs.readFileSync(__dirname+'/fromto/null.tmp').toString()
            );
            fs.unlink(__dirname+'/fromto/null.tmp');
        });
    }
}