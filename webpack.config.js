const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const packageJson = require('./package.json');

/**
 * Webpack Production Configuration
 */
module.exports = {
  entry: {
    background: path.resolve('src', 'background', 'background.ts'),
    content_script: [
      path.resolve('src', 'content_script', 'content_script.ts'),
      path.resolve('src', 'content_script', 'content_script.scss'),
    ],
  },
  output: {
    path: path.resolve('dist', 'src'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.ts$/,
        use: ['ts-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].css',
            },
          },
          'extract-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve('src', 'manifest.json'),
          to: path.resolve('dist'),
          transform: (contents) => {
            const manifestJson = JSON.parse(contents.toString());
            const newManifestJson = {
              // Specific order!
              name: manifestJson.name,
              description: packageJson.description,
              version: packageJson.version,
              homepage_url: packageJson.homepage,
              ...manifestJson,
            };
            return JSON.stringify(newManifestJson, null, '\t');
          },
        },
        {
          from: path.resolve('assets', 'icon-16.png'),
          to: path.resolve('dist'),
        },
        {
          from: path.resolve('assets', 'icon-48.png'),
          to: path.resolve('dist'),
        },
        {
          from: path.resolve('assets', 'icon-128.png'),
          to: path.resolve('dist'),
        },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        default: false,
        commons: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'initial',
          minSize: 1,
        },
      },
    },
  },
};
