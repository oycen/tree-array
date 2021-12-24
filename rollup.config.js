import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/index.ts',
  external: ['lodash.clonedeep'],
  output: [
    {
      format: 'iife',
      name: 'TreeArray',
      file: 'dist/index.iife.js',
      globals: {
        'lodash.clonedeep': 'clonedeep'
      }
    },
    {
      format: 'umd',
      name: 'TreeArray',
      file: 'dist/index.umd.js',
      globals: {
        'lodash.clonedeep': 'clonedeep'
      }
    },
    {
      format: 'cjs',
      exports: 'named',
      file: 'dist/index.js',
    },
    {
      format: 'es',
      file: 'dist/index.es.js',
    },
  ],
  plugins: [typescript()],
};
