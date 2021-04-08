
import 'should'
import * as transform from '../lib/index'
import * as transformSync from '../lib/sync'
import {Options, Transformer} from '../lib/index'

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
      
    it('sync', () => {
      // With records + handler
      const transformer: Array<any> = transformSync( ['record'], record => record )
      transformer.should.be.an.Array()
      // With records + options + handler
      transformSync( ['record'], {consume: true}, record => record )
    })
    
  })
  
  describe('Parser', () => {
    
    it('Expose options', () => {
      const transformer: Transformer = transform( record => record )
      const options: Options = transformer.options
      const keys: any = Object.keys(options)
      keys.sort().should.eql([
        'consume', 'objectMode', 'parallel'
      ])
    })
  
  })
  
  describe('Options', () => {
  
    it('consume', () => {
      const options: Options = {}
      options.consume = true
    })
    
    it('parallel', () => {
      const options: Options = {}
      options.parallel = 100
    })
    
    it('params', () => {
      const options: Options = {}
      options.params = { my_key: 'my value' }
    })
  
  })
  
  describe('State', () => {
  
    it('finished', () => {
      const transformer: Transformer = transform( record => record )
      const finished: number = transformer.state.finished
      finished.should.eql(0)
    })
    
    it('running', () => {
      const transformer: Transformer = transform( record => record )
      const running: number = transformer.state.running
      running.should.eql(0)
    })
    
    it('started', () => {
      const transformer: Transformer = transform( record => record )
      const started: number = transformer.state.started
      started.should.eql(0)
    })
  
  })
  
})
