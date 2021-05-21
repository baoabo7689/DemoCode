import { createAction } from "./util";

const metadata = [
    {
        action: "/Member/EnterPortal",
        name: "notifyLogin",
    },
    {
        action: "/Member/Balance",
        name: "balance",
    },
    {
        action: "/Member/PlaceBet",
        name: "placeBet",
    },
    {
        action: "/Member/EndGame",
        name: "endGame",
    },
    {
        action: "/Member/VoidGame",
        name: "voidGame",
    },
    {
        action: "/Member/EnterPortal",
        name: "enterPortal",
    },
    {
        action: "/Member/HitJackpot",
        name: "hitJackpot",
    },
    {
        action: "/Member/GetBetLimit",
        name: "getBetLimit",
    },
];

export default (configs) => createAction(metadata, configs);
