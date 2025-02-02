"use strict";

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "production",
  entry: {
    main: path.resolve(__dirname, "src/js/main.js"),
  },
  output: {
    assetModuleFilename: "img/[name].[contenthash][ext]",
    path: path.resolve(__dirname, "dist"),
    filename: "js/[name].[contenthash].min.js",
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: ["html-loader"],
      },
      {
        test: /\.(svgz?|png|jpe?g|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader, // extract css into files
          "css-loader", // translate css into commonjs
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader, // extract css into files
          "css-loader", // turn css into commonjs
          "sass-loader", // turn sass into css
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
          toplevel: true,
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].min.css",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/data"),
          to: "data",
        },
      ],
    }),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      chunks: "main",
      filename: "./index.html",
      template: path.resolve(__dirname, "src/index.raw.html"),
      inject: "head",
      minify: {
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        collapseInlineTagWhitespace: false,
        removeAttributeQuotes: true,
        removeComments: true,
        removeRedundantAttributes: true,
        sortAttributes: true,
        sortClassName: true,
      },
      scriptLoading: "defer",
    }),
    // Add ProvidePlugin for process:
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
  performance: { hints: false },
};
