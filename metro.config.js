// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ajout de l'extension 'cjs' aux fichiers assets si nécessaire
config.resolver.assetExts.push('cjs');

// Configuration supplémentaire pour résoudre les modules
config.resolver.extraNodeModules = {
  '@react-native-async-storage/async-storage': require.resolve('@react-native-async-storage/async-storage'),
};

module.exports = config;
