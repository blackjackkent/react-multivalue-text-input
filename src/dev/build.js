const { build } = require('esbuild');
const cssModulesPlugin = require('esbuild-css-modules-plugin');
const { dependencies } = require('../../package.json');

const entryFile = 'src/index.tsx';
const shared = {
	bundle: true,
	entryPoints: [entryFile],
	// Treat all dependencies in package.json as externals to keep bundle size to a minimum
	external: Object.keys(dependencies),
	logLevel: 'info',
	minify: true,
	sourcemap: true,
	plugins: [cssModulesPlugin()]
};

build({
	...shared,
	outdir: 'dist',
	splitting: true,
	format: 'esm',
	target: ['esnext']
}).catch(() => process.exit(1));

build({
	...shared,
	outfile: './dist/index.cjs.js',
	platform: 'node',
	target: ['node12.22.0']
}).catch(() => process.exit(1));
