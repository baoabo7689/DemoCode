import { stub } from "jest-micro-auto-stub";
import { reveal } from "jest-auto-stub";
import { Table } from "sc-game-base";
import MarketManagement from "@nex3/market-management";
import GetGameConfigsConsumer from "../get-game-configs-consumer";
import SocketIO from "socket.io";

describe("#get-game-configs-consumer", () => {
    describe("consume", () => {
        it("should emit correct game configs", async () => {
            // arrange
            const definition = new Table.TableGameDefinition({ id: 21, name: "roulette" });
            const gameData = new Table.TableGameData();
            const market = stub(MarketManagement);
            reveal(market).getGameMarketConfig.mockReturnValueOnce({ minBet: 10, maxBet: 20, maxBetChoices: [] });

            market.getGameMarketConfig;
            const consumer = new GetGameConfigsConsumer({ definition, gameData });

            const socketClient = stub(SocketIO.Socket);
            const player = {
                session: { currency: "in", language: "en" },
                socketClient,
            };

            MarketManagement.instance = market;

            // act
            await consumer.consume(player);

            //assert
            expect(socketClient.emit).toBeCalledWith("roulette", expect.anything());
        });
    });
});
