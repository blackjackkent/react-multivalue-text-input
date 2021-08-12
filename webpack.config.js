const webpack = require('webpack');
const path = require('path');

module.exports = {
	entry: ['./src/index.js'],
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'index.js'
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
						presets: ['env'],
						plugins: [
							'transform-object-rest-spread',
							'transform-react-jsx',
							'transform-runtime'
						]
					}
				}
			}
		]
	}
};
