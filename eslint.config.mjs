// @ts-check
import eslint from '@eslint/js';
import tslint from 'typescript-eslint';
import jestlint from 'eslint-plugin-jest';
import globals from 'globals';


export default tslint.config(
    {
        ignores: [
            'coverage/**/*',
            'dist/**/*',
            'docs-dist/**/*',
            'node_modules/**/*'
        ],
    },
    eslint.configs.recommended,
    ...tslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
            },
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        rules: {
            'no-control-regex': 'off',
            'no-empty': 'off',
            'object-curly-spacing': ['error', 'always'],
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-invalid-void-type': 'off',
            '@typescript-eslint/no-this-alias': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/triple-slash-reference': 'off',
        },
    },
    {
        files: [
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/*.spec.ts',
            '**/*.spec.tsx'
        ],
        plugins: {
            jest: jestlint,
        },
        rules: {
            ...jestlint.configs.recommended.rules,
            '@typescript-eslint/no-require-imports': 'off',
            'import/no-unresolved': 'off',
        },
    }
);
