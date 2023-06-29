const path = require("path");

const webpack = require("webpack");

const DIR_NAME = path.resolve("./");

const mode = "development";

module.exports = {
    mode,
    context: path.resolve(DIR_NAME),
    entry: "./src/app.js",
    output: {
        path: path.resolve(DIR_NAME, "dist"),
        filename: "app.js",
        clean: true,
        publicPath: "/",
    },
    plugins: [
        new webpack.IgnorePlugin({
            resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
        }),
    ],
    target: "node",
    resolve: {
        alias: {
            api: path.resolve(DIR_NAME, "src/api/"),
            myconstants: path.resolve("src/constants/"),
            database: path.resolve(DIR_NAME, "src/database/"),
            handlers: path.resolve(DIR_NAME, "src/handlers/"),
            scenes: path.resolve(DIR_NAME, "src/scenes/"),
            todoServices: path.resolve(DIR_NAME, "src/todoServices/"),
            utils: path.resolve(DIR_NAME, "src/utils/"),
        },
        extensions: ["", ".js"],
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
