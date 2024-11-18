import assert from 'assert';
import {parse as parseStream} from '../lib/stream.js'

describe('API Web Stream', () => {
  
  describe('stream/web/TransformStream', () => {
    
    it('simple parse', async () => {
      const stream = parseStream();

      const writer = stream.writable.getWriter();
      const reader = stream.readable.getReader();
      
      await writer.write(Buffer.from("A,B,C\nD,E,F"));
      await writer.close();
      
      assert.deepStrictEqual(await reader.read(), {
        done: false,
        value: ['A', 'B', 'C'],
      });
      assert.deepStrictEqual(await reader.read(), {
        done: false,
        value: ['D', 'E', 'F'],
      });
      assert.deepStrictEqual(await reader.read(), {
        done: true,
        value: undefined,
      });
    })
  })
})
