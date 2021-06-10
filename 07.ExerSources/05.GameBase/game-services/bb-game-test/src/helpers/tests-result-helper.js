import { getSettlementResult } from '../../../bb-game/src/helpers/result-helper';
import assert from 'assert';

describe('result-helper', function () {
  describe('#getSettlementResult', function () {
    it('should returncorrect dices', function () {
      const testCases = [
        {
          dices: {
            dice1: 'fish',
            dice2: 'crab',
            dice3: 'prawn',
          },
          expected: {
            fish: 1,
            crab: 1,
            prawn: 1,
            stag: 0,
            gourd: 0,
            rooster: 1,
          },
        },
      ];

      testCases.map((testCase) => {
        const actualResult = getSettlementResult(testCase.dices);
        const testResult = Object.keys(testCase.expected).filter(
          (k) => actualResult[k] !== testCase.expected[k]
        );

        assert.equal(testResult.length, 0);
      });
    });
  });
});
