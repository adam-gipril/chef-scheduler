const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  mode: 'production',
  devtool: 'inline-source-map',
  entry: path.resolve(__dirname, 'src', 'server.ts'),
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [{ test: /\.ts$/, use: ['babel-loader', 'ts-loader'], exclude: /node_modules/ }],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  plugins: [new CircularDependencyPlugin({ failOnError: true, exclude: /a\.js|node_modules/ })],
  externals: [nodeExternals()],
};
