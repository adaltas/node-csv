
csv = require '..'

csv()
.from(
	"""
	1	2	3
	a	b	c
	""", delimiter: '\t')
.to.array (data) ->
  console.log JSON.stringify data
