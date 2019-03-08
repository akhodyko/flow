const path = require('path');
const fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseDir = path.resolve(__dirname);
const inputFolder = baseDir + '/src/main/webapp/frontend';
const outputFolder = baseDir + '/src/main/webapp';
const build = 'build';

fs.mkdirSync(`${outputFolder}/${build}`, { recursive: true });
const statsFile = `${outputFolder}/${build}/stats.json`;

module.exports = {
  mode: 'production',
  context: inputFolder,
  entry: {
    index: './main.js'
  },

  output: {
    filename: `${build}/[name].js`,
    path: outputFolder
  },

  plugins: [
    // Generates the `stats.json` file which is used by flow to read templates for
    // server `@Id` binding
    function (compiler) {
      compiler.plugin('after-emit', function (compilation, done) {
        console.log("Emitted " + statsFile)
        fs.writeFile(statsFile, JSON.stringify(compilation.getStats().toJson(), null, 1), done);
      });
    },

    // Copy webcomponents polyfills. They are not bundled because they
    // have its own loader based on browser quirks.
    new CopyWebpackPlugin([{
      from: `${baseDir}/node_modules/@webcomponents/webcomponentsjs`,
      to: `${build}/webcomponentsjs/`
    }]),
  ]
};

