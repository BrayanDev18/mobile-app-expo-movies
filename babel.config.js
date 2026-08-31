module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-worklets/plugin',
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@/components': './src/components',
            '@/utils': './src/utils',
            '@/translate': './src/translate',
            '@/stores': './src/stores',
            '@/hooks': './src/hooks',
            '@/services': './src/services',
            '@/constants': './src/constants',
            '@/assets': './assets',
            '@/interfaces': './src/interfaces',
            '@/screens': './src/screens',
          },
        },
      ],
    ],
  };
};
