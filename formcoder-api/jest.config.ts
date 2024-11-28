import { Config } from 'jest';

const config: Config = {
  moduleNameMapper: {
    'src(.*)$': '<rootDir>/src/$1',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  /*testRegex: '.*\\.spec\\.ts$',*/
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  testMatch: ['<rootDir>/sequence/sequence.service.spec.ts'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/sequence/sequence.service.spec.ts'],
  coverageReporters: ['lcov', 'text'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
};

export default config;
