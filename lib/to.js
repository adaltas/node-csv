
var fs = require('fs'),
    utils = require('./utils');
    
module.exports = function(csv){
    return {
        stream: function(writeStream, options){
            if(options) utils.merge(csv.writeOptions, options);
            switch(csv.writeOptions.lineBreaks){
                case 'auto':
                    csv.writeOptions.lineBreaks = null;
                    break;
                case 'unix':
                    csv.writeOptions.lineBreaks = "\n";
                    break;
                case 'mac':
                    csv.writeOptions.lineBreaks = "\r";
                    break;
                case 'windows':
                    csv.writeOptions.lineBreaks = "\r\n";
                    break;
                case 'unicode':
                    csv.writeOptions.lineBreaks = "\u2028";
                    break;
            }
            writeStream.on('close', function(){
                csv.emit('end', csv.state.count);
                csv.readable = false;
                csv.writable = false;
            })
            csv.writeStream = writeStream;
            csv.state.buffer = new Buffer(csv.writeOptions.bufferSize || csv.from.options().bufferSize);
            csv.state.bufferPosition = 0;
            return csv;
        },
        path: function(path, options){
            // Merge user provided options
            if(options) utils.merge(csv.writeOptions,options);
            // clone options
            var options = utils.merge({}, csv.writeOptions);
            // Delete end property which otherwise overwrite `WriteStream.end()`
            delete options.end;
            // Create the write stream
            var stream = fs.createWriteStream(path, options);
            return csv.to.stream(stream, null);
        }
    }
}