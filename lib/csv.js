// Module CSV - Copyright David Worms <open@adaltas.com> (BSD Licensed)
// 
// 
//  |---------------|        |---------------|---------------|         |---------------|
//  |               |        |               |               |         |               |
//  |               |        |              CSV              |         |               |
//  |               |        |               |               |         |               |
//  |    Stream     |        |    Writer     |    Reader     |         |    Stream     |
//  |    Reader     | .pipe( |     API       |     API       | ).pipe( |    Writer     | )
//  |               |        |               |               |         |               |
//  |               |        |               |               |         |               |
//  |---------------|        |---------------|---------------|         |---------------|
// 
//  fs.createReadStream('in'.pipe(         csv()           ).pipe( fs.createWriteStream('out') )
// 
var EventEmitter = require('events').EventEmitter,
    stream = require('stream'),
    from = require('./from'),
    to = require('./to');

module.exports = function(){
    var state = {
        count: 0,
        countWriten: 0,
        field: '',
        line: [],
        lastC: '',
        quoted: false,
        commented: false,
        buffer: null,
        bufferPosition: 0
    }
    // Are we currently inside the transform callback? If so,
    // we shouldn't increment `state.count` which count provided lines
    var transforming = false;
    
    // Defined Class
    
    var CSV = function(){
        var self = this;
        // Set options
        this.writeOptions = {
            delimiter: null,
            quote: null,
            quoted: false,
            escape: null,
            columns: null,
            header: false,
            lineBreaks: null,
            flags: 'w',
            encoding: 'utf8',
            bufferSize: null,
            newColumns: false,
            end: true // Call `end()` on close
        };
        // A boolean that is true by default, but turns false after an 'error' occurred, 
        // the stream came to an 'end', or destroy() was called. 
        this.readable = true;
        // A boolean that is true by default, but turns false after an 'error' occurred 
        // or end() / destroy() was called. 
        this.writable = true;
        this.state = state;
        this.from = from(this);
        this.to = to(this);
    }
    CSV.prototype.__proto__ = stream.prototype;
    
    // Writting API
    
    /**
     * Write data.
     * Data may be string in which case it could span multiple lines. If data 
     * is an object or an array, it must represent a single line.
     * Preserve is for line which are not considered as CSV data.
     */
    CSV.prototype.write = function(data, preserve){
        if(!this.writable){ return; }
        if(typeof data === 'string' && !preserve){
            return parse(data);
        }else if(Array.isArray(data) && !transforming){
            state.line = data;
            return transform();
        }
        if(state.count === 0 && csv.writeOptions.header === true){
            write(csv.writeOptions.columns || csv.from.options().columns);
        }
        write(data, preserve);
        if(!transforming && !preserve){
            state.count++;
        }
    }
    
    CSV.prototype.end = function(){
        if(!this.writable){ return; }
        if (state.quoted) {
            // return csv.emit('error', new Error('Quoted field not terminated'));
            return error(new Error('Quoted field not terminated'));
        }
        // dump open record
        if (state.field || state.lastC === this.from.options().delimiter || state.lastC === this.from.options().quote) {
            if(csv.from.options().trim || csv.from.options().rtrim){
                state.field = state.field.trimRight();
            }
            state.line.push(state.field);
            state.field = '';
        }
        if (state.line.length > 0) {
            transform();
        }
        if(csv.writeStream){
            if(state.bufferPosition !== 0){
                csv.writeStream.write(state.buffer.slice(0, state.bufferPosition));
            }
            if(this.writeOptions.end){
                csv.writeStream.end();
            }else{
                csv.emit('end', state.count);
                csv.readable = false;
            }
        }else{
            csv.emit('end', state.count);
            csv.readable = false;
        }
    }
    
    // Transform API
    
    CSV.prototype.transform = function(callback){
        this.transformer = callback;
        return this;
    }
    
    var csv = new CSV();
    
    // Private API
    
    /**
     * Parse a string which may hold multiple lines.
     * Private state object is enriched on each character until 
     * transform is called on a new line
     */
    function parse(chars){
        chars = '' + chars;
        for (var i = 0, l = chars.length; i < l; i++) {
            var c = chars.charAt(i);
            switch (c) {
                case csv.from.options().escape:
                case csv.from.options().quote:
                    if( state.commented ) break;
                    var isEscape = false;
                    if (c === csv.from.options().escape) {
                        // Make sure the escape is really here for escaping:
                        // if escape is same as quote, and escape is first char of a field and it's not quoted, then it is a quote
                        // next char should be an escape or a quote
                        var nextChar = chars.charAt(i + 1);
                        if( !( csv.from.options().escape === csv.from.options().quote && !state.field && !state.quoted )
                        &&   ( nextChar === csv.from.options().escape || nextChar === csv.from.options().quote ) ) {
                            i++;
                            isEscape = true;
                            c = chars.charAt(i);
                            state.field += c;
                        }
                    }
                    if (!isEscape && c === csv.from.options().quote) {
                        if (state.field && !state.quoted) {
                            // Treat quote as a regular character
                            state.field += c;
                            break;
                        }
                        if (state.quoted) {
                            // Make sure a closing quote is followed by a delimiter
                            var nextChar = chars.charAt(i + 1);
                            if (nextChar && nextChar != '\r' && nextChar != '\n' && nextChar !== csv.from.options().delimiter) {
                                // throw new Error('Invalid closing quote; found "' + nextChar + '" instead of delimiter "' + csv.from.options().delimiter + '"');
                                return error(new Error('Invalid closing quote; found "' + nextChar + '" instead of delimiter "' + csv.from.options().delimiter + '"'));
                            }
                            state.quoted = false;
                        } else if (state.field === '') {
                            state.quoted = true;
                        }
                    }
                    break;
                case csv.from.options().delimiter:
                    if( state.commented ) break;
                    if( state.quoted ) {
                        state.field += c;
                    }else{
                        if(csv.from.options().trim || csv.from.options().rtrim){
                            state.field = state.field.trimRight();
                        }
                        state.line.push(state.field);
                        state.field = '';
                    }
                    break;
                case '\n':
                    if(state.quoted) {
                        state.field += c;
                        break;
                    }
                    if( !csv.from.options().quoted && state.lastC === '\r' ){
                        break;
                    }
                case '\r':
                    if(state.quoted) {
                        state.field += c;
                        break;
                    }
                    if( csv.writeOptions.lineBreaks === null ){
                        // Auto-discovery of linebreaks
                        csv.writeOptions.lineBreaks = c + ( c === '\r' && chars.charAt(i+1) === '\n' ? '\n' : '' );
                    }
                    if(csv.from.options().trim || csv.from.options().rtrim){
                        state.field = state.field.trimRight();
                    }
                    state.line.push(state.field);
                    state.field = '';
                    transform();
                    break;
                case ' ':
                case '\t':
                    if(state.quoted || (!csv.from.options().trim && !csv.from.options().ltrim ) || state.field) {
                        state.field += c;
                        break;
                    }
                    break;
                default:
                    if(state.commented) break;
                    state.field += c;
            }
            state.lastC = c;
        }
    }
    
    /**
     * Called by the `parse` function on each line. It is responsible for 
     * transforming the data and finally calling `write`.
     */
    function transform(){
        var line;
        if(csv.from.options().columns){
            // Extract column names from the first line
            if(state.count === 0 && csv.from.options().columns === true){
                csv.from.options().columns = state.line;
                state.line = [];
                state.lastC = '';
                return;
            }
            // Line stored as an object in which keys are column names
            var line = {};
            for(var i=0; i<csv.from.options().columns.length; i++){
                var column = csv.from.options().columns[i];
                line[column] = state.line[i]||null;
            }
            state.line = line;
            line = null;
        }
        if(csv.transformer){
            transforming = true;
            try{
                line = csv.transformer(state.line, state.count);
            }catch(e){
                return error(e);
            }
            
            if (csv.writeOptions.newColumns && !csv.writeOptions.columns && typeof line === 'object' && !Array.isArray(line)) {
                Object.keys(line)
                .filter(function(column) { return csv.from.options().columns.indexOf(column) === -1; })
                .forEach(function(column) { csv.from.options().columns.push(column); });
            }

            transforming = false;
        }else{
            line = state.line;
        }
        if(state.count === 0 && csv.writeOptions.header === true){
            write(csv.writeOptions.columns || csv.from.options().columns);
        }
        write(line);
        state.count++;
        state.line = [];
        state.lastC = '';
    }
    
    /**
     * Write a line to the written stream.
     * Line may be an object, an array or a string
     * Preserve is for line which are not considered as CSV data
     */
    function write(line, preserve){
        if(typeof line === 'undefined' || line === null){
            return;
        }
        if(!preserve){
            try {
                csv.emit('data', line, state.count);
            }catch(e){
                return error(e);
            }
        }
        if(typeof line === 'object'){
            if(!Array.isArray(line)){
                var columns = csv.writeOptions.columns || csv.from.options().columns;
                var _line = [];
                if(columns){
                    for(var i=0; i<columns.length; i++){
                        var column = columns[i];
                        _line[i] = (typeof line[column] === 'undefined' || line[column] === null) ? '' : line[column];
                    }
                }else{
                    for(var column in line){
                        _line.push(line[column]);
                    }
                }
                line = _line;
                _line = null;
            }else if(csv.writeOptions.columns){
                // We are getting an array but the user want specified output columns. In
                // this case, we respect the columns indexes
                line.splice(csv.writeOptions.columns.length);
            }
            if(Array.isArray(line)){
                var newLine = state.countWriten ? csv.writeOptions.lineBreaks || "\n" : '';
                for(var i=0; i<line.length; i++){
                    var field = line[i];
                    if(typeof field === 'string'){
                        // fine 99% of the cases, keep going
                    }else if(typeof field === 'number'){
                        // Cast number to string
                        field = '' + field;
                    }else if(typeof field === 'boolean'){
                        // Cast boolean to string
                        field = field ? '1' : '';
                    }else if(field instanceof Date){
                        // Cast date to timestamp string
                        field = '' + field.getTime();
                    }
                    if(field){
                        var containsdelimiter = field.indexOf(csv.writeOptions.delimiter || csv.from.options().delimiter) >= 0;
                        var containsQuote = field.indexOf(csv.writeOptions.quote || csv.from.options().quote) >= 0;
                        var containsLinebreak = field.indexOf("\r") >= 0 || field.indexOf("\n") >= 0;
                        if(containsQuote){
                            field = field.replace(
                                    new RegExp(csv.writeOptions.quote || csv.from.options().quote,'g')
                                  , (csv.writeOptions.escape || csv.from.options().escape)
                                  + (csv.writeOptions.quote || csv.from.options().quote));
                        }

                        if(containsQuote || containsdelimiter || containsLinebreak || csv.writeOptions.quoted){
                            field = (csv.writeOptions.quote || csv.from.options().quote) + field + (csv.writeOptions.quote || csv.from.options().quote);
                        }
                        newLine += field;
                    }
                    if(i!==line.length-1){
                        newLine += csv.writeOptions.delimiter || csv.from.options().delimiter;
                    }
                }
                line = newLine;
            }
        }else if(typeof line == 'number'){
            line = ''+line;
        }
        if(state.buffer){
            if(state.bufferPosition + Buffer.byteLength(line, csv.writeOptions.encoding) > csv.from.options().bufferSize){
                csv.writeStream.write(state.buffer.slice(0, state.bufferPosition));
                state.buffer = new Buffer(csv.from.options().bufferSize);
                state.bufferPosition = 0;
            }
            state.bufferPosition += state.buffer.write(line, state.bufferPosition, csv.writeOptions.encoding);
        }
        if(!preserve){
            state.countWriten++;
        }
        return true;
    }

    function error(e){
        csv.readable = false;
        csv.writable = false;
        csv.emit('error', e);
        // Destroy the input stream
        if(csv.readStream) csv.readStream.destroy();
        return e;
    }
    
    return csv;
};
