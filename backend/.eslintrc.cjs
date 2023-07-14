module.exports = {
    root: true,
    plugins: ['@typescript-eslint', 'import'],
    rules: {
        indent: ['error', 4],
    },
    extends: [
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.eslint.json',
    },
    rules: {"prefer-template": 1}
};
