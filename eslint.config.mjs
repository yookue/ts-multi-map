
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import js from '@eslint/js';
import {FlatCompat} from '@eslint/eslintrc';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});


export default [
    {
        ignores: ['src/**/*.test.ts*', 'test/**/*'],
    },
    ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/recommended'),
    {
        plugins: {
            '@typescript-eslint': typescriptEslint,
        },
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.jest,
            },
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        rules: {
            'no-control-regex': 'off',
            'no-empty': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-invalid-void-type': 'off',
            '@typescript-eslint/no-this-alias': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/triple-slash-reference': 'off',
        },
    }
];
