# sc-base-database

sc-base-database contains models of commonly used mongoDb collections (users, user-sessions, user-infos, game-configs) in database, which are intialized with a new connection.

## Installation

```sh
$ npm install sc-base-database
```

## How to use

```js
import { init } from 'sc-base-database';

await init({
        url: 'mongodb://localhost:27017', 
        options: {
            dbName: 'minigame',
            useNewUrlParser: true,
            useUnifiedTopology: true,
            auto_reconnect: true,
        }
    });
```