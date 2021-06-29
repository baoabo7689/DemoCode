import { stub } from "jest-micro-auto-stub";
import UserSignInConsumer from "../user-signin-consumer";
import { Core } from "sc-game-base";
import SocketIO from "socket.io";

describe("#user-signin-consumer", () => {
    // act
    const consumer = new UserSignInConsumer();

    it("inherit Core.BaseEventConsumers.UserSignInConsumer", () => {
        //assert
        expect(consumer instanceof Core.BaseEventConsumers.UserSignInConsumer);
    });
});

describe("#getUserBetLimit", () => {
    // arrange
    const socketClient = stub(SocketIO.Socket);

    const consumer = new UserSignInConsumer();

    it("always not emit userStakeLevel", async () => {
        // act
        await consumer.getUserBetLimit(null, null, socketClient);

        //assert
        expect(socketClient.message).not.toBeCalledWith("message", expect.anything());
    });
});
