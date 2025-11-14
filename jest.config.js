module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/bellebook-backend/',
    '/bellebook-web/',
    '/apps/',
    '/packages/',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/bellebook-backend/',
    '/bellebook-web/',
    '/apps/',
    '/packages/',
  ],
};
