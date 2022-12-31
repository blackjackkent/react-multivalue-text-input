const path = require('path');
module.exports = {
	components: 'src/components/**/*.{jsx,tsx}',
	propsParser: (filePath, source, resolver, handlers) => {
		const { ext } = path.parse(filePath);
		return ext === '.tsx'
			? require('react-docgen-typescript').parse(filePath, source, resolver, handlers)
			: require('react-docgen').parse(source, resolver, handlers);
	},
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: 'ts-loader',
					exclude: /node_modules/
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader']
				}
			]
		}
	},
	template: {
		head: {
			links: [
				{
					rel: 'stylesheet',
					href: 'https://bootswatch.com/3/cerulean/bootstrap.min.css'
				}
			]
		}
	}
};
