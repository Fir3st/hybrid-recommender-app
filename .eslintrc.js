module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    parserOptions: {
        parser: 'babel-eslint'
    },
    extends: 'plugin:vue/recommended',
    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    // add your custom rules here
    rules: {
        'vue/html-indent': ['error', 4],
        'vue/html-self-closing': ['error', {
            'html': {
                'void': 'any',
                'normal': 'any',
                'component': 'any'
            },
            'svg': 'always',
            'math': 'always'
        }],
        'semi': 1,
    }
};
