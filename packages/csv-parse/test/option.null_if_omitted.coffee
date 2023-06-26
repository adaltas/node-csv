
import { parse } from '../lib/index.js'

describe 'option null_if_omitted', ->

	it 'validation', ->
		parse '', null_if_omitted: true, (->)
		parse '', null_if_omitted: false, (->)
		parse '', null_if_omitted: null, (->)
		parse '', null_if_omitted: undefined, (->)
		(->
			parse '', null_if_omitted: 1, (->)
		).should.throw 'Invalid Option: null_if_omitted must be a boolean, got 1'
		(->
			parse '', null_if_omitted: "true", (->)
		).should.throw 'Invalid Option: null_if_omitted must be a boolean, got "true"'


	it 'without null_if_omitted', (next) ->
		parse """
		      h1,h2,h3
		      1,,3
		      4,"",6
		      """, delimiter: ',', columns: true, null_if_omitted: false, (err, records) ->
			records.should.eql [{ h1: '1', h2: '', h3: '3'}, { h1: '4', h2: '', h3: '6'}] unless err
			next err

	it 'with null_if_omitted', (next) ->
		parse """
		      h1,h2,h3
		      1,,3
		      4,"",6
		      """, delimiter: ',', columns: true, null_if_omitted: true, (err, records) ->
			records.should.eql [{ h1: '1', h2: null, h3: '3'}, { h1: '4', h2: '', h3: '6'}] unless err
			next err

