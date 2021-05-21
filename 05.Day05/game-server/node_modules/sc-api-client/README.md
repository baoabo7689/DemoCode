# sc-api-client

Saba API client for Node.js apps and services.

## Installation

```sh
npm install sc-api-client
```

## How to use

- Import sc-api-client

```js
import APIClient from "sc-api-client";

// You might need to import logger from sc-common as well.
import { logger } from "sc-common";
```

- Initialize APIClient

```js
const settings = {
  apiUrl: "https://api.luminetsoft.com",
  token: "bearer anytoken",
  useAuthenticate: true,
  requestTimeout: 3000,
};
const apiClient = new APIClient(settings, logger);
```

- Use APIClient's methods instead of

```js
const balance = await apiClient.member.balance(getBalanceParams);
const placingBetResult = await apiClient.member.placeBet(placeBetParams, {
  requestTimeout: apiSettings.placeBetTimeout,
});
//...
```
