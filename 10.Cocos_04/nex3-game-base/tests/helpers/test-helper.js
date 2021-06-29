export default {
    runTestCases(testCases, testMethod) {
        testCases.forEach((testCase) => testMethod(testCase));
    },
};
