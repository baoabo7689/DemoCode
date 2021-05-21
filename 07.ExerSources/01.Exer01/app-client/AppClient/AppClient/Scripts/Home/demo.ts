
class DemoController {
    gameController = new GameController();

    demo2(): void {
        // Get Data From API
        this.gameController.getData();
    }

    async demo3(): Promise<void> {
        // Get Data From API Promise
        await this.gameController.getDataPromise();
    }

    async demo4(): Promise<void> {
        // Get Data From API Asyns/Await
        await this.gameController.getDataAsync();
    }

    async demo5(): Promise<void> {
        // Write Log Async/Await
        await this.gameController.getAndLogDataAsync();
    }

    async demo6(): Promise<void> {
        // Write Log Promise
        await this.gameController.getAndLogDataPromise();
    }
}

const demo = new DemoController();
demo.demo6();

