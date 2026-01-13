// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expo = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expo,

  // Global ignores
  {
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**",
      ".expo/**",
      "android/**",
      "ios/**",
    ],
  },

  // TypeScript / React tweaks
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // Expo/React Native defaults er gode – bare små justeringer
      "react/react-in-jsx-scope": "off", // React 17+
      "react-native/no-inline-styles": "warn",

      // TypeScript hygiene
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],

      // Tillat console.warn / error, men ikke console.log
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
]);
