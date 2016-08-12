import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/index',
    dest: 'dist/roulade.js',
    format: 'cjs',

    // Transpile any ES2015 in the output file.
    plugins: [babel()],

    // Make the output executable.
//     banner: '#!/usr/bin/env node'
 };
