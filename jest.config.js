export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    setupFiles: ['dotenv/config'],
};

// preset: 'ts-jest' is used to tell Jest to use ts-jest as the test runner.
// testEnvironment: 'node' is used to tell Jest to use Node.js as the test environment.
// setupFiles: ['dotenv/config'] is used to tell Jest to load the .env file before running the tests.
