var webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
    context: __dirname + '/static/',
    entry: {
        "admin-workspace-index": './admin-workspace/js/index.js',
        "admin-workspace-auth-index": './admin-workspace/js/auth-index.js',
        "landing-index":  './landing/js/index.js',
        "landing-registration":  './landing/js/pages/registration.js',
        "landing-auth":  './landing/js/pages/auth.js',
        "landing-news-list-page":  './landing/js/pages/news-list-page.js',
        "landing-news-page":  './landing/js/pages/news-page.js',
        "landing-main":  './landing/js/pages/main.js',
        "landing-events":  './landing/js/pages/events.js',
        "landing-add-event-request":  './landing/js/pages/add-event-request.js',
        "landing-event-request":  './landing/js/pages/event-request.js',
    },
    output: { path: __dirname + '/static/dist/js/', filename: '[name].js'},
    module: {
        rules: [
            {
                test: /.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['env']
                }
            },
            {
                test: /\.vue$/,
                exclude: /node_modules/,
                loader: 'vue-loader'
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: 'css-loader',
                        options: {importLoaders: 1}
                    },
                    'sass-loader'
                ]
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    resolve: {
        alias: {
            vue$: 'vue/dist/vue.esm.js'
        },
        extensions: ['*', '.js', '.vue', '.json']
    }
};