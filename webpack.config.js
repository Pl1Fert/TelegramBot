import { resolve as _resolve } from "path";
import webpack from "webpack";

const DIR_NAME = _resolve("./");

const mode = "development";

export default {
    mode,
    context: _resolve(DIR_NAME),
    entry: "./src/app.js",
    output: {
        path: _resolve(DIR_NAME, "dist"),
        filename: "app.js",
        clean: true,
        publicPath: "/",
    },
    devServer: {
        hot: true,
        historyApiFallback: true,
    },
    plugins: [
        new webpack.IgnorePlugin({
            resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
        }),
    ],
    module: {},
    target: "node",
    resolve: {
        extensions: [".js"],
        alias: {
            api: _resolve(DIR_NAME, "src/api/"),
            sender: _resolve(DIR_NAME, "src/sender/"),
            constants: _resolve(DIR_NAME, "src/constants/"),
            database: _resolve(DIR_NAME, "src/database/"),
            handlers: _resolve(DIR_NAME, "src/handlers/"),
            scenes: _resolve(DIR_NAME, "src/scenes/"),
            todoServices: _resolve(DIR_NAME, "src/todoServices/"),
            utils: _resolve(DIR_NAME, "src/utils/"),
        },
        fallback: {
            crypto: false,
            util: false,
            timers: false,
            stream: false,
            assert: false,
            http: false,
            https: false,
            os: false,
            url: false,
            zlib: false,
            constants: false,
            querystring: false,
            fs: false,
            aws4: false,
            snappy: false,
            kerberos: false,
        },
    },
    stats: {
        errorDetails: true,
    },
    node: {
        global: false,
        __filename: false,
        __dirname: false,
    },
};
