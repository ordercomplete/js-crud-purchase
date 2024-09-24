const path = require("path");
const webpack = require("webpack");
const fs = require("fs");

// Функція для динамічного знаходження всіх входів
// function getEntries(srcDir) {
//   const directories = ["component", "container", "route"];
//   let entries = {};

//   directories.forEach((dir) => {
//     const fullPath = path.join(srcDir, dir);
//     const files = fs.readdirSync(fullPath);

//     files.forEach((file) => {
//       const fileWithoutExt = file.replace(/\.[^/.]+$/, "");
//       entries[fileWithoutExt] = path.join(fullPath, file);
//     });
//   });

//   return entries;
// }
function getEntries(srcDir) {
  const directories = ["component", "container", "route"];
  let entries = {};

  directories.forEach((dir) => {
    const fullPath = path.join(srcDir, dir);
    const files = getAllFilesRecursive(fullPath);

    files.forEach((file) => {
      const fileWithoutExt = file.replace(/\.[^/.]+$/, "");
      entries[fileWithoutExt] = path.join(fullPath, file);
    });
  });
  entries["error"] = path.join(srcDir, "container", "error.hbs");
  entries["index"] = path.join(srcDir, "route", "index.js");
  entries["style"] = path.join(srcDir, "container", "style.scss");

  return entries;
}

function getAllFilesRecursive(dir) {
  let files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      files = files.concat(getAllFilesRecursive(itemPath));
    } else {
      files.push(itemPath.substring(dir.length + 1));
    }
  }

  return files;
}
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
  context: path.resolve(__dirname, "src"),
  entry: getEntries("src"),
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "[name].js", // Використовуємо [name] для установлення імен вхідних файлів
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
        include: path.resolve(__dirname, "src"),
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "sass-loader"],
        include: path.resolve(__dirname, "src"),
      },
      {
        test: /\.hbs$/,
        loader: "handlebars-loader",
        include: path.resolve(__dirname, "src"),
      },
    ],
  },
};
