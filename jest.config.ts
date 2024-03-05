export default {
  verbose: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: './',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./test/setup-app.ts'],
  testRegex: 'test.e2e.ts',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['./src/**/*.(t|j)s'],
  // coveragePathIgnorePatterns: [
  //   '.module.ts',
  //   '<rootDir>/src/config/*',
  //   '<rootDir>/src/main.ts',
  //   '.mock.ts',
  // ],

  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
};
