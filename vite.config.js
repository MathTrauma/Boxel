/**
 * @type {import('vite').UserConfig}
 */

export default {
    build : {
        sourcemap : true,
    },
    base : process.env.NODE_ENV === 'production' ? '/Boxel/' : ''
}