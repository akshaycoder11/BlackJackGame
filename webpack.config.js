const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/ts/Main.ts",
  devtool: false,
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build"),
  },
  plugins: [
    new HtmlWebpackPlugin({ template: `./src/index.html`, inject: `head` }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/css", to: "./css/" },
        { from: "src/res/images/", to: "./res/images/" },
        { from: "src/res/manifest/", to: "./res/manifest/" },
        // { from: "src/res/viewManifest/", to: "./res/viewManifest/" },
      ],
    }),
  new MergeJsonWebpackPlugin({
    debug: true,
    output: {
        groupBy: [
            {
                pattern: "{./src/res/viewManifest/baseGame.json,./src/res/viewManifest/chipBank.json,./src/res/viewManifest/winpresentation.json,./src/res/viewManifest/postIntro.json,./src/res/viewManifest/cards.json,./src/res/viewManifest/chips.json}",
                fileName: "./res/viewManifest/combine.json",
            },
        ],
    },
    globOptions: {
        nosort: true,
    },
}),
  ],
  optimization: {
    minimize: false,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "build"),
    },
    port: 9000,
    hot: false,
    client: false,
    open: true,
  },
  mode: "production",
  performance: { hints: false },
};

