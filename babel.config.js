// eslint-disable-next-line no-undef
module.exports = {
  presets: [
    ['@babel/preset-typescript'],
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'entry',
        corejs: 3,
      },
    ],
  ],
  plugins: [['@babel/plugin-transform-runtime']],
}
