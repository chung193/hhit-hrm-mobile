module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-paper/babel',
    ['module-resolver', {
      root: ['./src'],
      alias: {
        '@components': './src/components',
        '@screens': './src/screens',
        '@utils': './src/utils',
        '@assets': './src/assets',
        '@hooks': './src/hooks',
        '@types': './src/types',
        '@services': './src/services',
        '@core': './src/core',
        '@providers': './src/providers',
      }
    }],
    'react-native-reanimated/plugin'
  ]
}

