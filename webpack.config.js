const path = require("path");
const webpack = require("webpack");

module.exports = {
  resolve: {
    fallback: {
      buffer: require.resolve("buffer/"),
      vm: require.resolve("vm-browserify"),
      assert: require.resolve("assert/"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util/"),
      crypto: require.resolve("crypto-browserify"),
      path: require.resolve("path-browserify"),
      zlib: require.resolve("browserify-zlib"),
      fs: false,
      tls: false,
      net: false,
      os: false,
      process: require.resolve("process/browser"),
      querystring: require.resolve("querystring-es3"),
      url: require.resolve("url/"),
    },
  },
  entry: "./src/route/index.js",
  output: {
    path: path.resolve(__dirname, "public/css"),
    publicPath: "/public/dist",
    filename: "app.js",
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.hbs$/,
        loader: "handlebars-loader",
      },
    ],
  },
};
