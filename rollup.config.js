import typescript from 'rollup-plugin-typescript2';

export default {
  input: './src/index.ts',
  output: [
    {
      format: 'iife',
      name: 'TreeArray',
      sourcemap: true,
      exports: 'named',
      file: 'dist/index.iife.js',
    },
    {
      format: 'umd',
      name: 'TreeArray',
      sourcemap: true,
      exports: 'named',
      file: 'dist/index.umd.js',
    },
    {
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      file: 'dist/index.js',
    },
    {
      format: 'es',
      sourcemap: true,
      exports: 'named',
      file: 'dist/index.es.js',
    },
  ],
  plugins: [typescript()],
};
