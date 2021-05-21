import _ from "lodash";

import TableProcessBetQueue from "sc-game-base/src/table/crons/table-process-bet-queue";
import PlaceBetPublisher from "../publishers/place-bet-publisher";

export default class ProcessBetQueue extends TableProcessBetQueue {  
    constructor(definition, gameData, publisher = null) {
        publisher = publisher ?? new PlaceBetPublisher(definition.name, gameData);

        super(definition, gameData, publisher);
    }

    async proceedBet(player, payload) {
       
    }
}
