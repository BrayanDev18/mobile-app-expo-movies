module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      ["inline-import", { extensions: [".sql"] }],
      "react-native-worklets/plugin",
      [
        "module-resolver",
        {
          root: ["./src"],
          alias: {
            "@/components": "./src/components",
            "@/expo-sqlite": "./src/expo-sqlite",
            "@/expo-sqlite/*": "./src/expo-sqlite/*",
            "@/utils": "./src/utils",
            "@/translate": "./src/translate",
            "@/stores": "./src/stores",
            "@/hooks": "./src/hooks",
            "@/services": "./src/services",
            "@/constants": "./src/constants",
            "@/assets": "./assets",
            "@/types": "./src/types",
            "@/interfaces": "./src/interfaces",
            "@/screens": "./src/screens",
            "@/screens/*": "./src/screens/*",
          },
        },
      ],
    ],
  };
};
