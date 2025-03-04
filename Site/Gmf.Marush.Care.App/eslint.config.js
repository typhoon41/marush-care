import defaultConfiguration from "@typhoon41/eslint-config";
import angular from "angular-eslint";

export default [
    {
        "ignores": ['.angular/**/*.js'],
    },
    ...defaultConfiguration,
    ...angular.configs.tsRecommended,
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
            "@stylistic/max-len": [
                "error",
                {
                    "code": 140,
                    "ignoreComments": true
                }
            ],
            "@stylistic/no-confusing-arrow": ["error", { "onlyOneSimpleParam": true }],
            "new-cap": [
                "error",
                {
                    "capIsNewExceptions": [
                        "Component",
                        "HostBinding",
                        "HostListener",
                        "Inject",
                        "Injectable",
                        "Input",
                        "NgModule",
                        "Output",
                        "Pipe",
                        "Subjectize",
                        "ViewChild",
                        "ViewChildren"
                    ]
                }
            ],
            "@typescript-eslint/prefer-readonly-parameter-types": "off",
            "@typescript-eslint/no-unsafe-enum-comparison": "off",
        }
    },
    {
        "files": ["src/**/*.html"],
        "languageOptions": {
            "parser": angular.templateParser
        },
        "plugins": {
            "@angular-eslint/template": angular.templatePlugin
        },
        "rules": {
            '@angular-eslint/template/alt-text': 'error',
            '@angular-eslint/template/banana-in-box': 'error',
            '@angular-eslint/template/click-events-have-key-events': 'error',
            '@angular-eslint/template/elements-content': 'error',
            '@angular-eslint/template/eqeqeq': 'error',
            '@angular-eslint/template/interactive-supports-focus': 'error',
            '@angular-eslint/template/label-has-associated-control': 'error',
            '@angular-eslint/template/mouse-events-have-key-events': 'error',
            '@angular-eslint/template/no-autofocus': 'error',
            '@angular-eslint/template/no-distracting-elements': 'error',
            "@angular-eslint/template/no-negated-async": "off",
            '@angular-eslint/template/role-has-required-aria': 'error',
            '@angular-eslint/template/table-scope': 'error',
            '@angular-eslint/template/valid-aria': 'error',
        }
    }
];