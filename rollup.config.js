import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/index.ts',
  output: [
    {
      format: 'iife',
      name: 'TreeArray',
      file: 'dist/index.iife.js',
    },
    {
      format: 'umd',
      name: 'TreeArray',
      file: 'dist/index.umd.js',
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
