import chai from "chai";
import SettleGameRoundConsumer from "../../src/consumers/settle-game-round-consumer";
import TestHelper from "../helpers/test-helper";

describe("/consumers/settle-game-round-consumer", function () {
    describe("#calculateBetResult", function () {
        TestHelper.runTestCases(
            [
                {
                    settlementResult: { fish: true },
                    roundResult: { dice1: 3, dice2: 0, dice3: 0 },
                    bet: { fish: 10 },
                    odds: [],
                    expectedValue: {
                        totalBetAmount: 10,
                        totalWin: 10,
                        netWin: 0,
                        totalLost: 0,
                        winningByChoices: { fish: 10 },
                    },
                    message: "should be correct",
                },
                {
                    settlementResult: { fish: true },
                    roundResult: { dice1: 3, dice2: 3, dice3: 0 },
                    bet: { fish: 10 },
                    odds: { single: 2, double: 3.5, triple: 6 },
                    expectedValue: {
                        totalBetAmount: 10,
                        totalWin: 35,
                        netWin: 25,
                        totalLost: 0,
                        winningByChoices: { fish: 35 },
                    },
                    message: "should be correct",
                },
            ],
            (testCase) => {
                it(testCase.message, async function () {
                    // arrange
                    const consumer = new SettleGameRoundConsumer({});

                    // act
                    const actualValue = consumer.calculateBetResult(
                        testCase.settlementResult,
                        testCase.bet,
                        testCase.odds,
                        testCase.roundResult
                    );

                    // assert
                    chai.assert.deepEqual(actualValue, testCase.expectedValue);
                });
            }
        );
    });
});
