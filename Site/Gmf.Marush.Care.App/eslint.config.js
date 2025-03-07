import defaultConfiguration from "@typhoon41/eslint-config-angular";
import angular from "angular-eslint";

export default [
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
            ],
            "@angular-eslint/prefer-signals": "off"
        }
    }
];