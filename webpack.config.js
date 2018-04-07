const path = require( 'path' );

const CleanWebpackPlugin = require( 'clean-webpack-plugin' );
const CopyWebpackPlugin = require( 'copy-webpack-plugin' )

/**
 * Webpack Production Configuration
 */
module.exports = {
    mode: 'production',
    entry: {
        popup: path.resolve( 'src', 'popup', 'index.ts' ),
        options: path.resolve( 'src', 'options', 'index.ts' ),
        content_script: path.resolve( 'src', 'content_script', 'index.ts' ),
        background: path.resolve( 'src', 'background', 'index.ts' )
    },
    output: {
        path: path.resolve( 'dist', 'src' ),
        filename: '[name].js'
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
        ] )
    ]
};
