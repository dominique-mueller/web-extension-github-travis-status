const path = require( 'path' );

const webpack = require( 'webpack' );
const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' )

/**
 * Webpack Production Configuration
 */
module.exports = {
    entry: {
        background: path.resolve( 'src', 'background', 'index.ts' ),
        content_script: path.resolve( 'src', 'content_script', 'index.ts' ),
        options: path.resolve( 'src', 'options', 'index.ts' ),
        popup: path.resolve( 'src', 'popup', 'index.ts' )
    },
    output: {
        path: path.resolve( 'dist', 'src' ),
        filename: '[name].js'
    },
    resolve: {
        extensions: [
            '.ts',
            '.js'
        ],
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.ts$/,
                use: [
                    'ts-loader'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin( [
            path.resolve( 'dist' )
        ] ),
        new CopyWebpackPlugin( [
            {
                from: path.resolve( 'src', 'manifest.json' ),
                to: path.resolve( 'dist' )
            }
        ] ),
        new webpack.ProvidePlugin( {
            browser: 'webextension-polyfill'
        } )
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                default: false,
                commons: {
                    test: /node_modules/,
                    name: 'vendor',
                    chunks: 'initial',
                    minSize: 1
                }
            }
        }
    }
};
