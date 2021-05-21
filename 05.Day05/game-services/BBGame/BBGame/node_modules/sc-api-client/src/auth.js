import { createAction } from "./util";

const metadata = [
    {
        action: "/AuthVerification/verify",
        name: "verifyToken",
    },
    {
        action: "/signin/index",
        name: "singleSignOn",
    },
];

export default (configs) => createAction(metadata, configs);
