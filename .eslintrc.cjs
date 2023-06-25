module.exports = {
    env: {
        es6: true,
        browser: true,
        node: true,
    },
    overrides: [],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["import"],
    rules: {
        "no-unused-vars": ["warn", { vars: "all", args: "none" }],
        "import/order": [
            "error",
            {
                groups: [
                    "builtin",
                    "external",
                    "internal",
                    "parent",
                    "sibling",
                    "index",
                    "object",
                    "type",
                ],
                "newlines-between": "always-and-inside-groups",
            },
        ],
    },
};
