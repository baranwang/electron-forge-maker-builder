module.exports = {
  packagerConfig: {},
  makers: [
    {
      name: '@baranwang/electron-forge-maker-builder',
      /**
       * @type {import('app-builder-lib').Configuration}
       */
      config: {
        mac: {
          target: ['dmg', 'zip'],
        },
        win:{
          target: ['zip'],
        }
      },
    },
  ],
  plugins: [
    [
      '@electron-forge/plugin-webpack',
      {
        mainConfig: './webpack.main.config.js',
        renderer: {
          config: './webpack.renderer.config.js',
          entryPoints: [
            {
              html: './src/index.html',
              js: './src/renderer.js',
              name: 'main_window',
            },
          ],
        },
      },
    ],
  ],
};
