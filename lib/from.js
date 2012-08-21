
var fs = require('fs'),
    utils = require('./utils');

module.exports = function(csv){
    var options = {
        delimiter: ',',
        quote: '"',
        escape: '"',
        columns: null,
        flags: 'r',
        encoding: 'utf8',
        bufferSize: 8 * 1024 * 1024,
        trim: false,
        ltrim: false,
        rtrim: false
    };
    return {
        options: function(){
            if(arguments.length){
                utils.merge(options, arguments[0]);
                return csv;
            }else{
                return options;
            }
        },
        array: function(data, options){
            this.options(options);
            process.nextTick(function(){
                for(var i=0; i<data.length; i++){
                    csv.write(data[i]);
                }
                csv.end();
            });
            return csv;
        },
        string: function(data, options){
            this.options(options);
            process.nextTick(function(){
                // A string is handle exactly the same way as a single `write` call 
                // which is then closed. This is because the `write` function may receive
                // multiple and incomplete lines.
                csv.write(data);
                csv.end();
            });
            return csv;
        },
        path: function(path, options){
            this.options(options);
            var stream = fs.createReadStream(path, csv.from.options());
            stream.setEncoding(csv.from.options().encoding);
            return csv.from.stream(stream, null);
        },
        stream: function(readStream, options){
            this.options(options);
            readStream.on('data', function(data) {
                // parse(data);
                csv.write(data.toString());
            });
            readStream.on('error', function(e) {
                error(e)
            });
            readStream.on('end', function() {
                csv.end();
            });
            csv.readStream = readStream;
            return csv;
        }
    }
}