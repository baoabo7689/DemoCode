const TYPES = new Array("big", "small", "odd", "even", "earth", "fire", "gold", "water", "wood");

export default class KenoProMaxResult {
    result: Array<number>
    resultSumText: string
    settlementResult: string

    constructor(result = null, settlementResult = null) {
        this.result = result || new Array();
        this.resultSumText = result ? this.sumText(result) : "";
        this.settlementResult = settlementResult ? this.getSettlementResult(settlementResult) : "";
    }

    sumText(result) {
        return result.reduce((sum, x) => sum + x, 0)
    }

    getSettlementResult(result) {
        const resultArr = [];
        TYPES.forEach(function (type) {
            if (result[type]) {
                resultArr.push(type.toUpperCase());
            }
        })

        return resultArr.join(" - ");
    }
}