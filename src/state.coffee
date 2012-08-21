
module.exports = ->
    count: 0
    countWriten: 0
    field: ''
    line: []
    lastC: ''
    quoted: false
    commented: false
    buffer: null
    bufferPosition: 0
    # Are we currently inside the transform callback? If so,
    # we shouldn't increment `state.count` which count provided lines
    transforming: false