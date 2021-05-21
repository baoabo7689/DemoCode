var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class DemoController {
    constructor() {
        this.gameController = new GameController();
    }
    demo2() {
        // Get Data From API
        this.gameController.getData();
    }
    demo3() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get Data From API Promise
            yield this.gameController.getDataPromise();
        });
    }
    demo4() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get Data From API Asyns/Await
            yield this.gameController.getDataAsync();
        });
    }
    demo5() {
        return __awaiter(this, void 0, void 0, function* () {
            // Write Log Async/Await
            yield this.gameController.getAndLogDataAsync();
        });
    }
    demo6() {
        return __awaiter(this, void 0, void 0, function* () {
            // Write Log Promise
            yield this.gameController.getAndLogDataPromise();
        });
    }
}
const demo = new DemoController();
demo.demo6();
