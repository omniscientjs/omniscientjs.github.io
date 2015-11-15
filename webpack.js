var webpack = require('webpack');

module.exports = function (options) {
  return {
    plugins: options.watch ? [ new webpack.DefinePlugin({ DEBUG: true }) ] : [],
    watch: options.watch,
    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loaders: [
            'babel-loader'
          ]
        },
        {
          test: /\.less$/,
          loaders: [
            "style-loader",
            "css-loader",
            "autoprefixer-loader?browsers=last 2 version",
            "less-loader?strictMath&cleancss"
          ]
        }
      ]
    }
  };
};
