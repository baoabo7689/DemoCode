// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import MainControl, { GameStatus } from './MainControl';

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Prefab)
    EnemyPrefab: cc.Prefab = null;

    enemies: cc.Node[] = [];
    mainControl: MainControl = null;
    enemyPool: cc.NodePool = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.mainControl = this.node.getComponent('MainControl');

        this.enemyPool = new cc.NodePool();
        let initCount = 2;
        for (let i = 0; i < initCount; ++i) {
            let enemy = cc.instantiate(this.EnemyPrefab);
            this.enemyPool.put(enemy);
        }
    }

    start() {}

    init() {
        this.initEnemies();
    }

    initEnemies() {
        for (var i = 0; i < this.enemies.length; i++) {
            this.enemyPool.put(this.enemies[i]);
        }

        this.enemies = [this.enemyPool.get(), this.enemyPool.get()];
        for (var i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];
            this.node.addChild(enemy);
            enemy.setPosition(this.getNewEnemyPosition());
            enemy.getComponent('EnemyControl').game = this;
        }
    }

    getNewEnemyPosition() {
        var upOrDown = Math.random() - 0.5 > 0 ? 1 : -1;

        // Screen: 288x512 => 144x256
        var randX = 144 + Math.random() * 200;
        var randY = Math.random() * 100 + 50;
        return cc.v2(randX, upOrDown * randY);
    }

    update(dt) {
        if (this.mainControl.gameStatus !== GameStatus.Game_Playing) {
            return;
        }

        for (var i = 0; i < this.enemies.length; i++) {
            const enemy = this.enemies[i];
            enemy.x -= 2;
            if (enemy.x < -180) {
                enemy.setPosition(this.getNewEnemyPosition());
            }
        }
    }

    getProgressScore() {
        let update_fillRange = this.mainControl.gameScore * 0.5;
        update_fillRange = Math.min(1, update_fillRange);
        return update_fillRange;
    }

    gameOver() {}
}
