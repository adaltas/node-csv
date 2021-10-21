
import 'should'
import { transform, Options, Transformer } from '../lib/index.js'

describe('api.types', () => {
  
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
  
  describe('Parser', () => {
    
    it('Expose options', () => {
      const transformer: Transformer = transform( record => record )
      const options: Options = transformer.options
      const keys: any = Object.keys(options)
      keys.sort().should.eql([
        'consume', 'objectMode', 'parallel', 'params'
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
