const {
    isNumber,
} = require('./number');

describe('src/utils/number/number', () => {
    describe('isNumber', () => {
        const validDefaultsObjects = [
            {
                someNumber: 7,
                returnExpected: true,
            },
            {
                someNumber: "7",
                returnExpected: true,
            },
            {
                someNumber: "sete sete",
                returnExpected: false,
            },
        ];

        test.each(validDefaultsObjects)('should returns validation of the provided someNumber', ({ someNumber, returnExpected }) => {
            expect(isNumber(someNumber)).toEqual(returnExpected);
        });
    });

});
