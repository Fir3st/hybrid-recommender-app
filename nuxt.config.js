const pkg = require('./package');
const config = require('config');

module.exports = {
    mode: 'universal',
    srcDir: 'client/',

    /*
     ** Headers of the page
     */
    head: {
        titleTemplate: '%s | Hybrid recommender app',
        meta: [
            {
            charset: 'utf-8'
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: pkg.description
            }
        ],
        link: [
            {
                rel: 'icon',
                type: 'image/x-icon',
                href: '/favicon.ico'
            }
        ]
    },

    /*
     ** Customize the progress-bar color
     */
    loading: {
        color: '#3B8070'
    },

    /*
     ** Global CSS
     */
    css: [
        'element-ui/lib/theme-chalk/index.css',
        '@/assets/css/main.sass'
    ],

    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        '@/plugins/element-ui',
        '@/plugins/globals'
    ],

    /*
     ** Nuxt.js modules
     */
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/auth',
        'bootstrap-vue/nuxt'
    ],

    /*
    ** Router configuration
     */
    router: {
        middleware: ['auth']
    },

    /*
    ** axios configuration
     */
    axios: {
        baseURL: `http://${config.get('host')}:${config.get('port')}`
    },

    /*
    ** Auth configuration
     */
    auth: {
        strategies: {
            local: {
                endpoints: {
                    login: { url: '/auth/login', method: 'post', propertyName: 'token' },
                    logout: { url: '/auth/logout', method: 'post' },
                    user: { url: '/users/me', method: 'get', propertyName: 'user' }
                }
            }
        },
        redirect: {
            login: '/login',
            logout: '/login',
            home: '/'
        },
        watchLoggedIn: true,
        rewriteRedirects: false,
        resetOnError: true
    },

    /*
     ** Build configuration
     */
    build: {
        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {
            // Run ESLint on save
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                });
            }
        }
    },
    generate: {
        dir: 'client/dist'
    }
};
