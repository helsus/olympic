/** @type {import("jest").Config} **/
const config = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
		"\\.css$": "<rootDir>/__mocks__/styleMock.ts",
	},
};

export default config;
