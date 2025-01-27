const path = require('path');
const fs = require('fs');
const requireHacker = require('require-hacker');
const withCSS = require('@zeit/next-css');
const withImages = require('next-images');

function setupRequireHacker() {
  const webjs = '.web.js';
  const webModules = ['antd-mobile', 'rmc-picker'].map(m =>
    path.join('node_modules', m)
  );

  requireHacker.hook('js', filename => {
    if (
      filename.endsWith(webjs) ||
      webModules.every(p => !filename.includes(p))
    )
      return;

    const webFilename = filename.replace(/\.js$/, webjs);
    if (!fs.existsSync(webFilename)) return;

    return fs.readFileSync(webFilename, { encoding: 'utf8' });
  });

  requireHacker.hook('svg', filename =>
    requireHacker.to_javascript_module_source(`#${path.parse(filename).name}`)
  );
}

setupRequireHacker();

function moduleDir(m) {
  return path.dirname(require.resolve(`${m}/package.json`));
}

if (typeof require !== 'undefined') {
  require.extensions['.css'] = () => {};
}

module.exports = withImages(
  withCSS({
    cssModules: true,
    webpack(config) {
      config.target = 'electron-renderer';

      config.resolve.extensions = ['.web.js', '.js', '.json'];

      config.module.rules.push(
        {
          test: /\.(svg)$/i,
          loader: 'emit-file-loader',
          options: {
            name: 'dist/[path][name].[ext]',
          },
          include: [moduleDir('antd-mobile'), __dirname],
        },
        {
          test: /\.(svg)$/i,
          loader: 'svg-sprite-loader',
          include: [moduleDir('antd-mobile'), __dirname],
        }
      );

      return config;
    },
    exportPathMap() {
      return {
        '/home': { page: '/home' },
        '/live': { page: '/live' },
        '/preview': { page: '/preview' },
        '/scoreboard': { page: '/scoreboard' },
        '/settings': { page: '/settings' },
        '/standings': { page: '/standings' },
      };
    },
  })
);
