
import 'should'
import {transform} from '../lib/index'

describe('API Types', () => {

  describe('Initialisation', () => {

    it('stream', () => {
      // With handler
      const transformer = transform( record => record )
      transformer.should.be.an.Object() // Disable unused variable warning
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

})
