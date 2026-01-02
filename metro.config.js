const { getDefaultConfig } = require("expo/metro-config");
const { withRorkMetro } = require("@rork-ai/toolkit-sdk/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Configure resolver to handle zod/v4 import by aliasing it to zod
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver?.extraNodeModules,
    "zod/v4": path.resolve(__dirname, "node_modules/zod"),
  },
};

module.exports = withRorkMetro(config);
