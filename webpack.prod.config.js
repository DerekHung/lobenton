"use strict";

var path = require('path');
var webpack = require('webpack');
var ExtracTextPlugin = require('extract-text-webpack-plugin');
var rootPath = path.resolve(__dirname, path.relative(__dirname,''));
var bundle = {
	bundle: [
		'babel-polyfill',
		'./src/client/index.js'
	],
	en:['./src/client/locales/en/en.js'],
	zhTW: ['./src/client/locales/zhTW/zhTW.js']
};

module.exports = function webpackBundleConfigMain(config) {
	return {
		entry: bundle,
		debug: true,
		devtool: 'eval',
		resolve: {
			root: [ rootPath ],
			extensions: ["", ".js", ".jsx"]
		},
		output: {
			path: path.join(rootPath, '/public/build/'),
			filename: config.name + '_[name].js',
			libraryTarget: 'var',
			library: config.name + '_[name]'
		},
		// externals: {
		// 	//"c_platform": "window.c_platform_bundle",
		// 	"src/configs/client":"window.configs"
		// },
		plugins: [
			// new webpack.ProvidePlugin({
			// 	//"c_platform": "c_platform",
			// 	"src/configs/client":"src/configs/client"
			// }),
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false
				}
			}),
			new ExtracTextPlugin(config.name+'.css', {
				allChunks: true
			})
		],
		module: {
			loaders: [
				{
					test: /\.js$/,
					loader: 'babel-loader',
					exclude: /node_modules\/(?!lobenton)/,
					include: rootPath,
					query: {
						plugins: [],
						compact: false
					}
				},
				{
					test: /\.css$/,
					loader: ExtracTextPlugin.extract('style',"css?modules&localIdentName=[name]__[local]___[hash:base64:5]"),
					include: rootPath
				},
				{
	        test: /\.png$/,
	        loader: 'file'
	      },
				{
	        test: /\.jpg$/,
	        loader: 'file'
	      },
				{
	        test: /\.gif$/,
	        loader: 'file'
	      },
	      {
	        test: /\.svg$/,
	        loader: 'file'
	      }
	    ]
		}
	};
};
