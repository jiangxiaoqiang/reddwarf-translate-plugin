  const path = require('path');
  const webpack = require('webpack');
  const MiniCssExtractPlugin = require( 'mini-css-extract-plugin');
  const HtmlWebpackPlugin = require( 'html-webpack-plugin');
  const CopyPlugin = require("copy-webpack-plugin");
  const { VueLoaderPlugin } = require("vue-loader");

  module.exports = {
    entry : {
      // https://stackoverflow.com/questions/70891730/is-it-possible-to-let-different-entry-package-to-different-output-path-in-webpac
      'popup/popup' : './src/popup/',
      'background/background': './src/background/',
      'content/content': './src/content/',
      'option/option':'./src/options/' 
    } ,
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      alias: {
          // https://stackoverflow.com/questions/50805384/module-not-found-error-cant-resolve-vue-path-not-correct
          vue: 'vue/dist/vue.esm-bundler.js',
          // https://stackoverflow.com/questions/65018431/webpack-5-uncaught-referenceerror-process-is-not-defined
          process: 'process/browser',
          // https://stackoverflow.com/questions/70921310/how-to-make-the-webpack-5-x-src-path-is-the-project-real-src-path-not-the-webpac
          '@': path.resolve(__dirname, '../../../src'),
      },
    },
    output : {
      path : path.resolve(__dirname, '../../bundle') ,
      filename : '[name].js'
    },
    module : {
      rules : [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/]
          },
          include: [
            path.resolve(__dirname, '../../../node_modules/js-wheel'),
            path.resolve(__dirname, '../../../src')
          ],
          exclude: /node_modules|\.d\.ts$/
        },
        {
          test: /\.d\.ts$/,
          loader: 'ignore-loader'
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test : /\.js$/ ,
          exclude : [ /node_modules(?!(\/|\\?\\)(translation\.js|selection-widget|connect\.io|chrome-env)\1)/ ] ,
          loader : 'babel-loader'
        } ,
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
        },
        {
          test : /\.(scss)$/ ,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
        },
        // https://stackoverflow.com/questions/69427025/programmatic-webpack-jest-esm-cant-resolve-module-without-js-file-exten
        {
          test: /\.m?js/,
          type: "javascript/auto",
        },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
      ]
    },
    plugins : [
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new VueLoaderPlugin(),
      new CopyPlugin({
        patterns: [
          { from: "src/manifest.json", to: "manifest.json" },
          { from: "src/resource/image", to: "resource/image" },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
      }),
      new HtmlWebpackPlugin({
        filename: 'popup/popup.html',
        template: 'src/popup/index.html',
        inject: false,
      }),
      new HtmlWebpackPlugin({
        filename: 'option/options.html',
        template: 'src/options/index.html',
        inject: false,
      }),
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: false,
        __VUE_PROD_DEVTOOLS__: false,
      }),
    ]
  };

