const fs = require('fs');
const path = require('path');

function getTsconfigPaths() {
  const tsconfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'tsconfig.json'), 'utf8'));
  const paths = tsconfig.compilerOptions.paths || {};
  const aliases = {};

  Object.keys(paths).forEach((alias) => {
    const key = alias.replace('/*', '');
    const value = paths[alias][0].replace('/*', '');
    aliases[key] = `./src/${value}`;
  });

  return aliases;
}

module.exports = function(api) {
  api.cache(true);
  const aliases = getTsconfigPaths();

  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
      '@babel/preset-typescript',
      'module:metro-react-native-babel-preset'
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: aliases,
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      ],
      ['@babel/plugin-transform-class-properties', { loose: true }],
      ['@babel/plugin-transform-private-methods', { loose: true }],
      ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ]
  };
};
