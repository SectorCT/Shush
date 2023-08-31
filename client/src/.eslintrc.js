module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"settings": {
		"react": {
			"version": "detect"
		}
	},
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended"
	],
	"overrides": [
		{
			"env": {
				"node": true
			},
			"files": [
				".eslintrc.{js,cjs}"
			],
			"parserOptions": {
				"sourceType": "script"
			}
		}
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"@typescript-eslint",
		"react",
		"babel",
	],
	"rules": {
		"prefer-arrow-callback": [
			"error", 
			{ 
				"allowNamedFunctions": false 
			}
		],
		"arrow-parens": [
			"error", 
			"always"
		],
		"indent": [
			"error",
			"tab"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"babel/no-unused-expressions": "error",
		"@typescript-eslint/naming-convention": [
			"error",
			{
				selector: "function",
				format: ["camelCase"],
				filter: {
					regex: "^\\w+(Props|Parameters)$",
					match: true,
				},
			},
			{
				selector: "variable",
				format: ["camelCase", "PascalCase", "UPPER_CASE"],
			},
			{
				selector: "typeLike",
				format: ["PascalCase"],
			},
			{
				selector: "interface",
				format: ["PascalCase"],
				custom: {
					regex: "^I[A-Z]",
					match: true,
				},
			}
		],
	},
};