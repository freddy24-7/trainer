import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import prettier from "eslint-plugin-prettier";
import cleanCode from "eslint-plugin-clean-code";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import sonarjs from "eslint-plugin-sonarjs";
import _import from "eslint-plugin-import";
import jest from "eslint-plugin-jest";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "coverage/**/*",
        "node_modules/**/*",
        "**/jest.config.ts",
        "**/jest.setup.ts",
        "src/components/ui**",
        "src/lib/prisma.ts",
        "src/lib/utils.ts",
        "src/app/not-found.js",
        "src/app/api/pusher/**/*",
        "src/lib/services/editPlayerService.ts",
        "src/inngest/*",
    ],
}, ...fixupConfigRules(compat.extends(
    "next/core-web-vitals",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
)), {
    plugins: {
        prettier: fixupPluginRules(prettier),
        "clean-code": cleanCode,
        "@typescript-eslint": typescriptEslint,
        sonarjs,
        import: fixupPluginRules(_import),
        jest,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            project: "./tsconfig.json",
            tsconfigRootDir: "./",
        },
    },

    settings: {
        "import/resolver": {
            typescript: {
                project: "./tsconfig.json",
            },
        },

        react: {
            version: "detect",
        },
    },

    rules: {
        "prettier/prettier": "error",

        complexity: ["warn", {
            max: 8,
        }],

        "max-lines": ["warn", {
            max: 250,
        }],

        "max-lines-per-function": ["warn", {
            max: 90,
        }],

        "max-params": ["warn", {
            max: 4,
        }],

        "max-depth": ["warn", {
            max: 2,
        }],

        "max-classes-per-file": ["warn", 1],
        "sonarjs/cognitive-complexity": ["warn", 10],

        "sonarjs/no-duplicate-string": ["warn", {
            threshold: 3,
        }],

        "sonarjs/no-collapsible-if": "warn",
        "sonarjs/no-identical-expressions": "warn",
        "sonarjs/no-inverted-boolean-check": "warn",

        "@typescript-eslint/no-unused-vars": ["warn", {
            vars: "all",
            args: "after-used",
            ignoreRestSiblings: false,
        }],

        "@typescript-eslint/explicit-module-boundary-types": "warn",

        "@typescript-eslint/naming-convention": ["warn", {
            selector: "variableLike",
            format: ["camelCase", "PascalCase"],
            leadingUnderscore: "allow",
            trailingUnderscore: "allow",
        }, {
            selector: "function",
            format: ["camelCase", "PascalCase"],
            leadingUnderscore: "allow",
            trailingUnderscore: "allow",

            prefix: [
                "get",
                "set",
                "handle",
                "fetch",
                "create",
                "update",
                "delete",
                "format",
                "add",
                "remove",
            ],
        }, {
            selector: "function",
            format: ["PascalCase"],

            filter: {
                regex: "^[A-Z]",
                match: true,
            },

            leadingUnderscore: "allow",
            trailingUnderscore: "allow",
        }, {
            selector: "function",
            format: ["camelCase"],

            filter: {
                regex: "^use[A-Z]",
                match: true,
            },

            leadingUnderscore: "allow",
            trailingUnderscore: "allow",
        }],

        "@typescript-eslint/consistent-type-definitions": ["warn", "interface"],
        "@typescript-eslint/no-extraneous-class": "warn",
        "@typescript-eslint/no-explicit-any": "error",

        "@typescript-eslint/explicit-function-return-type": ["warn", {
            allowExpressions: true,
        }],

        "no-restricted-imports": ["error", {
            paths: [{
                name: "axios",
                message: "Use dependency injection for HTTP clients instead of importing axios directly.",
            }],
        }],

        "import/order": ["warn", {
            groups: ["builtin", "external", "internal"],

            pathGroups: [{
                pattern: "services/**",
                group: "internal",
                position: "before",
            }, {
                pattern: "components/**",
                group: "internal",
                position: "before",
            }, {
                pattern: "hooks/**",
                group: "internal",
                position: "before",
            }, {
                pattern: "utils/**",
                group: "internal",
                position: "before",
            }, {
                pattern: "lib/**",
                group: "internal",
                position: "before",
            }, {
                pattern: "app/**",
                group: "internal",
                position: "after",
            }],

            "newlines-between": "always",

            alphabetize: {
                order: "asc",
                caseInsensitive: true,
            },
        }],

        "import/no-cycle": ["error", {
            maxDepth: 1,
        }],

        "import/no-unresolved": "error",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react/jsx-boolean-value": ["warn", "always"],

        "react/jsx-no-bind": ["warn", {
            allowArrowFunctions: true,
        }],

        "react/no-danger": "warn",
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "jest/no-identical-title": "error",
        "jest/prefer-to-have-length": "warn",
        "jest/valid-expect": "error",

        "no-warning-comments": ["warn", {
            terms: ["todo", "fixme"],
            location: "start",
        }],
    },
}, {
    files: ["**/tailwind.config.ts", "**/tailwind.config.js"],

    rules: {
        "import/no-restricted-imports": "off",
    },
}, {
    files: ["src/components/**"],

    rules: {
        "import/no-restricted-imports": "off",
    },
}, {
    files: ["src/lib/prisma.ts"],

    rules: {
        "no-var": "off",
    },
}, {
    files: ["src/lib/utils.ts"],

    rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
    },
}, {
    files: ["src/utils/pusherUtils.ts"],

    rules: {
        "@typescript-eslint/no-explicit-any": "off",
    },
}, {
    files: ["__tests__/**/*.ts", "__tests__/**/*.tsx"],

    rules: {
        "max-lines": ["warn", {
            max: 300,
            skipBlankLines: true,
            skipComments: true,
        }],

        "max-lines-per-function": "off",
        "jest/no-disabled-tests": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
}];