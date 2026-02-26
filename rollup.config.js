import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-typescript2'

export default {
  input: 'src/index.ts',
  // treat i18next and related plugins as external runtime deps so Rollup won't bundle them
  external: (id) => /^(i18next|i18next-icu|i18next-http-backend)(\/|$)/.test(id),
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      exports: 'named'
    },
    {
      file: 'dist/index.esm.js',
      format: 'es'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      check: false,
      clean: true,
      tsconfigOverride: {
        compilerOptions: {
          declaration: false,
          skipLibCheck: true
        },
        exclude: ['node_modules']
      }
    })
  ]
}
