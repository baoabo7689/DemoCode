var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class GameController {
    constructor() {
        this.gameAPIUrl = "http://localhost:3000/game-data";
        this.gameData = [];
        this.gameIndex = 0;
        this.logInterval = 0;
        this.loadedData = 0;
        this.resData = "";
    }
    resetValue() {
        this.resData = "";
        this.gameData = [];
        this.gameIndex = 0;
        this.loadedData = 0;
        clearInterval(this.logInterval);
    }
    getData() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.gameAPIUrl);
        xhr.onload = function (_) {
            const res = this.responseText;
            document.body.textContent = "Demo 2: " + res;
        };
        xhr.send();
    }
    getDataPromise() {
        return new Promise((resolve, _) => {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", this.gameAPIUrl);
            xhr.onload = function (_) {
                const res = this.responseText;
                document.body.textContent = "Demo 3: " + res;
                resolve(res);
            };
            xhr.send();
        });
    }
    getDataAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new Promise((resolve, _) => {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", this.gameAPIUrl);
                xhr.onload = function (_) {
                    const res = this.responseText;
                    document.body.textContent = "Demo 4: " + res;
                    resolve(res);
                };
                xhr.send();
            });
            return result;
        });
    }
    getAndLogDataAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            this.resetValue();
            const result = yield new Promise((resolve, _) => {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", this.gameAPIUrl);
                xhr.onload = function (_) {
                    const res = this.responseText;
                    document.body.textContent = "Demo 5: " + res;
                    self.resData = res;
                    self.logGameDataAsync();
                    resolve(res);
                };
                xhr.send();
            });
            return result;
        });
    }
    logGameDataAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield new Promise((resolve, _) => {
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
        });
    }
    getAndLogDataPromise() {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            this.resetValue();
            return new Promise((resolve, _) => {
                var xhr = new XMLHttpRequest();
                xhr.open("GET", this.gameAPIUrl);
                xhr.onload = function (_) {
                    self.resData = this.responseText;
                    document.body.textContent = "Demo 6: " + self.resData;
                    const result = self.logGameDataPromise();
                    resolve(result);
                };
                xhr.send();
            });
        });
    }
    logGameDataPromise() {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
}
