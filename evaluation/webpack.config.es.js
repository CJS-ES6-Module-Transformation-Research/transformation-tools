/* eslint-disable no-sync */
import BundleAnalyzerPlugin from 'webpack-bundle-analyzer';
import nodeExternals from 'webpack-node-externals'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if(!fs.existsSync('./webpack-bundles')) {
  fs.mkdirSync('./webpack-bundles');
}

const pkg = JSON.parse(fs.readFileSync('./package.json'));

const config = {
  entry: path.resolve(__dirname, '..', pkg.main),
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '..', 'webpack-bundles'),
    filename: process.env.NODE_ENV + '.js',
  },
  externals: [nodeExternals()],
  plugins: [
    new BundleAnalyzerPlugin.BundleAnalyzerPlugin({
      analyzerMode: 'json',
      reportFilename: process.env.NODE_ENV + '.json',
      openAnalyzer: false
    })
  ],
  optimization: {
    usedExports: true,
    providedExports: true,
  }
};

export default config;
