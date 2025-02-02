"use strict";

const path = require("path");
const webpack = require("webpack");
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const DashboardPlugin = require("webpack-dashboard/plugin");

module.exports = {
  mode: "development",
  entry: {
    main: path.resolve(__dirname, "src/js/main.js"),
  },
  output: {
    assetModuleFilename: "img/[name].[contenthash][ext]",
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    open: true,
    port: 8080,
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: ["html-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.(svgz?|png|jpe?g|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader", // inject styles into DOM
          "css-loader", // translate css into commonjs
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          "style-loader", // inject styles into DOM
          "css-loader", // turn css into commonjs
          "sass-loader", // turn sass into css
        ],
      },
    ],
  },
  plugins: [
    new HtmlPlugin({
      chunks: "main",
      filename: "./index.html",
      inject: "head",
      scriptLoading: "defer",
      template: path.resolve(__dirname, "src/index.raw.html"),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/data"),
          to: "data",
        },
      ],
    }),
    new DashboardPlugin(),
    // Provide process polyfill:
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
  resolve: {
    fallback: {
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("buffer/"),
      assert: require.resolve("assert/"),
    },
  },
  // By default webpack logs warnings if the bundle is bigger than 200kb.
  performance: { hints: false },
  watch: false,
  watchOptions: {
    ignored: /node_modules/,
  },
};
