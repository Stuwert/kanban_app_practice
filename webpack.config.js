const merge = require('webpack-merge')
const webpack = require('webpack');
const path = require('path');

const NpmInstallPlugin = require('npm-install-webpack-plugin')

const TARGET = process.env.npm_lifecycle_event;

process.env.BABEL_ENV = TARGET;

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

const common = {
  //Entry accpets a path or an object of entries
  //using the later form given it's convenient with more complexity

  entry: {
    app: PATHS.app
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    filename: 'bundle.js'
  },
  module:{
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: PATHS.app
      }
    ],
    loaders: [
      {
        //Test expects a RegExp.
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
        //Include accepts either a path or an array of PATHS
        include: PATHS.app
      },
      {
        test: /\.jsx?$/,
        loaders: ['babel?cacheDirectory'],
      }
    ]
  },
};

//Default config

if (TARGET === 'start' || !TARGET){
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,

      //Enable history API fallback so HTML5 History API
      //based routing works.  This is a good default that
      //comes in handy in more complicated situations
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      // Displays only errors
      stats: 'errors-only',

      //Parse host and port from env

      host: process.env.HOST,
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true // --saves it
      })
    ]
  });
}

if(TARGET === 'build' ){
  module.exports = merge(common, {})
}
