/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'jsdom',

	moduleNameMapper: {
		'\\.(css|scss)$': '<rootDir>/utilities/styleMock.ts'
	},
	setupFilesAfterEnv: ['<rootDir>/utilities/testSetup.ts'],
	testPathIgnorePatterns: ['/node_modules/', '/utilities/', '/build/components/', '/dist/']
};
