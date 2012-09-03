
module.exports = ->

  ###
  
  `options.from`: Options of the CSV input source
  -----------------------------------------------

  Default values are:
  *   `delimiter`   ,
  *   `quote`       "
  *   `escape`      "
  *   `columns`     null
  *   `flags`       r
  *   `encoding`    utf8
  *   `trim`        false
  *   `ltrim`       false
  *   `rtrim`       false

  ###
  from:
    delimiter: ','
    quote: '"'
    escape: '"'
    columns: null
    flags: 'r'
    encoding: 'utf8'
    trim: false
    ltrim: false
    rtrim: false
  
  ###
  
  `options.to`: Options of the CSV output source
  -----------------------------------------------

  Default options are:

  Default options are:
  *   `delimiter`   
  *   `quote`     
  *   `quoted`    
  *   `escape`    
  *   `columns`     
  *   `header`    
  *   `lineBreaks`  
  *   `flags`     
  *   `encoding`    
  *   `newColumns`  
  *   `end`         Call `end()` on close

  ###
  to:
    delimiter: null
    quote: null
    quoted: false
    escape: null
    columns: null
    header: false
    lineBreaks: null
    flags: 'w'
    encoding: 'utf8'
    newColumns: false
    end: true

