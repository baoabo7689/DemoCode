import { logger } from "sc-common";
import { Core } from "sc-game-base";

import Translation from "@nex3/translation";
import languages from "../resources/translation/languages";
import MarketManagement from "@nex3/market-management";

export default class BaseActionConsumer extends Core.BaseEventConsumers.PlaceBetConsumer {
    async validateBetRequest(player, payload) {
        const criteria = await this.composeValidationCriteria(player, payload);
        const failedCriterion = criteria.find((criterion) => criterion.failure);

        if (failedCriterion) {
            this.publisher.publishToUser(player.UID, { endBet: -1, notice: failedCriterion.notice });
            return false;
        }

        return true;
    }

    async composeActionValidationCriteria(player, payload) {
        return [];
    }

    async composeValidationCriteria(player, payload) {
        const bettingTimeValidationCriteria = await this.composeBettingTimeValidationCriteria(player) ?? [];
        const actionValidationCriteria = await this.composeActionValidationCriteria(player, payload) || [];

        return bettingTimeValidationCriteria.concat(actionValidationCriteria);
    }

    async composeBettingTimeValidationCriteria(player) {
        const configs = this.gameData.gameConfigs;
        const marketManagement = MarketManagement.getInstance();
        const gameMarketConfigs = await marketManagement.getGameMarketConfig(this.definition.id, player.session.currency, player?.session?.language);

        return [
            {
                failure: !configs.enabled,
                notice: configs.disabled_message,
            },
            {
                failure: !gameMarketConfigs.enabled,
                notice: gameMarketConfigs.disabledMessage,
            }
        ];
    }

    async consume(player, payload) {
        try{     
            const name = player.profile.name;        

            if (!(await this.validateBetRequest(player, payload))) {
                return;
            }

            if (!this.gameData.ingame[name]) {
                const newPlayer = {
                    name: player.profile.name,
                    betTracks: {},
                    betQueue: [],
                };
    
                this.gameData.ingame[name] = newPlayer;
            }
    
            this.gameData.ingame[name].betQueue.push({ player, payload });
        }
        catch(e){            
            logger.logError(e);
            const translation = Translation.getInstance(player?.session?.language, languages);
            this.publisher.publishToUser(player.UID, { endBet: -1, notice: translation.t(translation.keys.cannotBetAtTheMoment)});
        }   
    }
}
