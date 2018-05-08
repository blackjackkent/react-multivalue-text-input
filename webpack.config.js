const webpack = require('webpack');
let path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSCSS = new ExtractTextPlugin('[name].styles.css');
module.exports = {
	entry: ['./src/index.js'],
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'index.js',
		libraryTarget: 'commonjs2'
	},
	devtool: 'eval-source-map',
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				include: path.resolve(__dirname, 'src'),
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			},
			{
				test: /\.(scss)$/,
				use: ['css-hot-loader'].concat(extractSCSS.extract({
					fallback: 'style-loader',
					use: [
						{
							loader: 'css-loader',
							options: { alias: { '../img': '../public/img' } }
						},
						{
							loader: 'sass-loader'
						}
					]
				}))
			}
		]
	},
	plugins: [
		extractSCSS,
		new webpack.NamedModulesPlugin()
	],
	externals: {
		react: 'commonjs react' // this line is just to use the React dependency of our parent-testing-project instead of using our own React.
	}
};
