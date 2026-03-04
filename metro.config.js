const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  maxWorkers: 4,
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  // Increase timeout for slow systems
  server: {
    port: 8081,
    // Timeout to wait for bundle compilation (ms)
    enhanceMiddleware: (middleware, server) => {
      return (req, res, next) => {
        // Extend timeout for requests
        res.setTimeout(120000);
        return middleware(req, res, next);
      };
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
