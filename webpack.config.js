const { resolve } = require("path");

const webpack = require("webpack");

const DIR_NAME = resolve("./");

const mode = "development";

module.exports = {
    mode,
    context: resolve(DIR_NAME),
    entry: "./src/app.js",
    output: {
        path: resolve(DIR_NAME, "dist"),
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
        extensions: [".js"],
        alias: {
            api: resolve(DIR_NAME, "src/api/"),
            sender: resolve(DIR_NAME, "src/sender/"),
            constants: resolve(DIR_NAME, "src/constants/"),
            database: resolve(DIR_NAME, "src/database/"),
            handlers: resolve(DIR_NAME, "src/handlers/"),
            scenes: resolve(DIR_NAME, "src/scenes/"),
            todoServices: resolve(DIR_NAME, "src/todoServices/"),
            utils: resolve(DIR_NAME, "src/utils/"),
        },
    },
};
