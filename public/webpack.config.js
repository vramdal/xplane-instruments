var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
        'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
        './main.js' // Your appʼs entry point
    ],
    output: { path: __dirname, filename: 'bundle.js' },
    devtool: 'source-map',
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ['react-hot', 'jsx?harmony'],
                include: path.join(__dirname, 'src')
            },
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?limit=10000&minetype=application/font-woff"
            }

        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};