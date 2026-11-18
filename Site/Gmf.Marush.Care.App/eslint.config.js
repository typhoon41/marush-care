import defaultConfiguration from "@typhoon41/eslint-config-angular";
import angular from "angular-eslint";
import { defineConfig } from "eslint/config";
import componentMemberVisibility from "./eslint-rules/component-member-visibility.js";

export default defineConfig([
    {
        "ignores": ['.angular/**/*.js'],
    },
    ...defaultConfiguration,
    {
        "processor": angular.processInlineTemplates,
        "files": ["src/**/*.ts"],
        "plugins": {
            "marush": { "rules": { "component-member-visibility": componentMemberVisibility } }
        },
        "rules": {
            "marush/component-member-visibility": "error",
            "@angular-eslint/prefer-inject": "error",
            "@typescript-eslint/prefer-readonly": "error",
            "max-lines": ["error", { "max": 100, "skipBlankLines": true, "skipComments": true }],
            "@angular-eslint/component-class-suffix": "off",
            "@angular-eslint/component-selector": [
                "error",
                {
                    "prefix": [
                        "marush"
                    ],
                    "style": "kebab-case",
                    "type": "element"
                }
            ],
            "@angular-eslint/directive-selector": [
                "error",
                {
                    "prefix": [
                        "marush"
                    ],
                    "style": "camelCase",
                    "type": "attribute"
                }
            ]
        }
    }
]);