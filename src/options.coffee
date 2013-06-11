
###
Input and output options
========================

The `options` property provide access to the `from` and `to` object used to store options. This
property is for internal usage and could be considered private. It is recommanded to use
the `from.options()` and `to.options()` to access those objects.

###
module.exports = ->

  from:
    rowDelimiter: null
    delimiter: ','
    quote: '"'
    escape: '"'
    columns: null
    comment: ''
    flags: 'r'
    encoding: 'utf8'
    trim: false
    ltrim: false
    relax: false
    rtrim: false

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
    eof: false

