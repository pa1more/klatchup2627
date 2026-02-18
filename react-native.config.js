module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./src/assets/fonts'],
};


// react-native.config.js
module.exports = {
  dependencies: {
    'react-native-linear-gradient': {
      platforms: { ios: null }, // 👈 disable iOS autolinking
    },
  },
};

