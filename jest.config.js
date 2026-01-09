/** @type {import('jest').Config} */
const config = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!expo-modules-core|expo-web-browser|react-native|@react-native|@expo|expo.*)'
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = config;