
import { nodeResolve } from '@rollup/plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import builtins from 'rollup-plugin-node-builtins';
import eslint from '@rollup/plugin-eslint';

export default [{
  onwarn: function(warning, rollupWarn) {
    // Not much we can do, Node.js `readable-stream/readable.js` and
    // `readable-stream/duplex.js` from `rollup-plugin-node-builtins` raise this
    // issue.
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    rollupWarn(warning);
  },
  input: 'lib/index.js',
  output: [
    {
      file: `dist/esm/index.js`,
      format: 'esm'
    },
    {
      file: `dist/iife/index.js`,
      format: 'iife',
      name: 'stream_transform',
    },
    {
      file: `dist/umd/index.js`,
      name: 'csv',
      format: 'umd',
    },
  ],
  plugins: [eslint({
    fix: true,
  }), globals(), builtins(), nodeResolve()],
}, {
  input: 'lib/index.js',
  output: [
    {
      file: `dist/cjs/index.cjs`,
      format: 'cjs'
    },
  ],
  plugins: [eslint({
    fix: true,
  }), nodeResolve()],
}, {
  onwarn: function(warning, rollupWarn) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') return;
    rollupWarn(warning);
  },
  input: 'lib/sync.js',
  output: [
    {
      file: `dist/esm/sync.js`,
      format: 'esm'
    },
    {
      file: `dist/iife/sync.js`,
      format: 'iife',
      name: 'stream_transform_sync'
    },
    {
      file: `dist/umd/sync.js`,
      name: 'csv',
      format: 'umd'
    },
  ],
  plugins: [eslint({
    fix: true,
  }), globals(), builtins(), nodeResolve()],
}, {
  input: 'lib/sync.js',
  output: [
    {
      file: `dist/cjs/sync.cjs`,
      format: 'cjs'
    },
  ],
  plugins: [eslint({
    fix: true,
  }), nodeResolve()],
}];
