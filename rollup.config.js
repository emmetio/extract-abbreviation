export default {
	entry: './index.js',
	targets: [
		{format: 'cjs', dest: 'dist/extract-abbreviation.cjs.js'},
		{format: 'es',  dest: 'dist/extract-abbreviation.es.js'}
	]
};
