import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/bin/app.js',
    dest: 'dist/app.js',
    format: 'umd',

    // Transpile any ES2015 in the output file.
    plugins: [babel()],

    // Make the output executable.
    banner: '#!/usr/bin/env node'
};
