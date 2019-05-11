
import 'should'
import * as csv from '../lib/index'
import * as transform from 'stream-transform/lib/index'
import {Options, Transformer} from 'stream-transform/lib/index'

describe('API Types', () => {
  
  describe('Initialisation', () => {
    
    it('stream', () => {
      // With handler
      const transformer: Transformer = transform( record => record )
      transformer.should.be.an.Object()
      // With handler + callback
      transform( record => record, (err, records) => err || records )
      // With records + handler
      transform( ['record'], record => record )
      // With options + handler
      transform( {consume: true}, record => record )
      // With records + options + handler
      transform( ['record'], {consume: true}, record => record )
      // With records + options + handler + callback
      transform( ['record'], {consume: true}, record => record, (err, records) => err || records )
    })
    
  })
