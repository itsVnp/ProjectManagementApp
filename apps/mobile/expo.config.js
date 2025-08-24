const { getDefaultConfig } = require('expo/metro-config');

module.exports = {
  ...getDefaultConfig(__dirname),
  resolver: {
    ...getDefaultConfig(__dirname).resolver,
    alias: {
      '@': './src',
      '@components': './src/components',
      '@screens': './src/screens',
      '@services': './src/services',
      '@store': './src/store',
      '@theme': './src/theme',
      '@utils': './src/utils',
    },
  },
  transformer: {
    ...getDefaultConfig(__dirname).transformer,
    minifierConfig: {
      keep_fnames: true,
      mangle: {
        keep_fnames: true,
      },
    },
  },
}; 