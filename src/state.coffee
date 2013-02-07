
module.exports = ->
  count: 0
  # field: ''
  line: []
  # lastC: ''
  countWriten: 0
  # Are we currently inside the transform callback? If so,
  # we shouldn't increment `state.count` which count provided lines
  transforming: 0
