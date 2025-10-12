import defaultConfiguration from "@typhoon41/eslint-config-angular";
import angular from "angular-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
        "ignores": ['.angular/**/*.js'],
    },
    ...defaultConfiguration,
    {
        "processor": angular.processInlineTemplates,
        "files": ["src/**/*.ts"],
        "rules": {
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