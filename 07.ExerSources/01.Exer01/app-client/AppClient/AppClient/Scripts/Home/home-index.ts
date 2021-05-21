class GameController {
    gameAPIUrl = "http://localhost:3000/game-data";
    gameData = [];
    gameIndex = 0;
    logInterval = 0;
    loadedData = 0;
    resData = "";

    resetValue(): void {
        this.resData = "";
        this.gameData = [];
        this.gameIndex = 0;
        this.loadedData = 0;
        clearInterval(this.logInterval);
    }

    getData(): void {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.gameAPIUrl);

        xhr.onload = function (this: XMLHttpRequest, _: ProgressEvent) {
            const res = this.responseText;
            document.body.textContent = "Demo 2: " + res;
        };

        xhr.send();
    }

    getDataPromise(): Promise<string> {
        return new Promise((resolve, _) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", this.gameAPIUrl);

            xhr.onload = function (this: XMLHttpRequest, _: ProgressEvent) {
                const res = this.responseText;
                document.body.textContent = "Demo 3: " + res;
                resolve(res);
            };

            xhr.send();
        });
    }

    async getDataAsync(): Promise<string> {
        const result: string = await new Promise((resolve, _) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", this.gameAPIUrl);

            xhr.onload = function (this: XMLHttpRequest, _: ProgressEvent) {
                const res = this.responseText;
                document.body.textContent = "Demo 4: " + res;
                resolve(res);
            };

            xhr.send();
        });

        return result;
    }

    async getAndLogDataAsync(): Promise<string> {
        const self = this;
        this.resetValue();

        const result: string = await new Promise((resolve, _) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", this.gameAPIUrl);

            xhr.onload = function (this: XMLHttpRequest, _: ProgressEvent) {
                const res = this.responseText;
                document.body.textContent = "Demo 5: " + res;
                self.resData = res;
                self.logGameDataAsync();
                resolve(res);
            };

            xhr.send();
        });

        return result;
    }

    async logGameDataAsync(): Promise<boolean> {
        const result: boolean = await new Promise((resolve, _) => {
            const res = this.resData;
            const gameData = JSON.parse(res);
            this.gameData = gameData;

            this.logInterval = setInterval(() => {
                if (this.gameIndex == gameData.length) {
                    this.gameIndex = 0;
                    clearInterval(this.logInterval);
                    resolve(true);
                    return;
                }

                console.log(gameData[this.gameIndex]);
                this.gameIndex++;
            }, 500);
        });

        return result;
    }

    async getAndLogDataPromise(): Promise<boolean> {
        const self = this;
        this.resetValue();

        return new Promise((resolve, _) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", this.gameAPIUrl);

            xhr.onload = function (this: XMLHttpRequest, _: ProgressEvent) {
                self.resData = this.responseText;
                document.body.textContent = "Demo 6: " + self.resData;

                const result = self.logGameDataPromise();
                resolve(result);
            };

            xhr.send();
        });
    }

    async logGameDataPromise(): Promise<boolean> {
        return new Promise(resolve => {
            const res = this.resData;
            const gameData = JSON.parse(res);
            this.gameData = gameData;

            this.logInterval = setInterval(() => {
                if (this.gameIndex == gameData.length) {
                    this.gameIndex = 0;
                    clearInterval(this.logInterval);
                    resolve(true);
                    return;
                }

                console.log(gameData[this.gameIndex]);
                this.gameIndex++;
            }, 500);
        });
    }
}













