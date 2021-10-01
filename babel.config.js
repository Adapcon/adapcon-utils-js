const buildPresets = [
  [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage',
      modules: false, // importante para que o tree-shaking funcione
      corejs: '3.1',
      targets: {
        browsers: [
          '> 0.5%',
          'last 2 versions',
          'not ie <= 9',
        ],
      },
    },
  ],
];
module.exports = {
  presets: (process.env.NODE_ENV === 'development' ? devPresets : buildPresets),
  plugins: [
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ],
  env: {
    coverage: {
      // "presets": [
      //   "@babel/preset-env"
      // ],
      plugins: [
        [
          'istanbul',
          {
            useInlineSourceMaps: false,
            exclude: [
              '**/*.test.js',
            ],
          },
        ],
      ],
    },
  },
};