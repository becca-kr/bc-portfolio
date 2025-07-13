// eslint.config.js
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
import { fixupConfigRules } from "@eslint/compat";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";

export default [
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
      // Definindo as variáveis globais injetadas pelo ambiente Canvas
      globals: {
        ...globals.browser, // Adiciona globais de navegador (window, document, etc.)
        __firebase_config: "readonly",
        __app_id: "readonly",
        __initial_auth_token: "readonly",
      },
    },
    plugins: {
      "react-hooks": pluginReactHooks,
      "react-refresh": pluginReactRefresh,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...fixupConfigRules(pluginReactConfig).rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/prop-types": "off", // Desativa a validação de prop-types, comum em projetos com hooks
      // Ignora as variáveis específicas que são injetadas pelo ambiente e podem não ser usadas diretamente
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^(appId|db|auth)$",
        },
      ],
    },
    settings: {
      react: {
        version: "detect", // Detecta automaticamente a versão do React
      },
    },
  },
];