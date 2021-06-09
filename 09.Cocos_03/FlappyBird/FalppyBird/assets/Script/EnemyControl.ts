// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import Level01Control from './Level01Control';

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Vec2)
    position: cc.Vec2 = null;

    level01Control: Level01Control = null;

    movementTime: number = 1;
    moveX: number = 100;
    moveDirection: number = -1;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.level01Control = this.node.parent.getComponent('Level01Control');

        // const enemyMovement = this.runMovementAction();
        // cc.tween(this.node).then(enemyMovement).start();
    }

    start() {}

    update(dt) {}

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        switch (other.tag) {
            case 4:
            case 5:
                this.node.setPosition(this.level01Control.getNewEnemyPosition());
                break;
            default:
                return;
        }
    }

    runMovementAction() {
        var moveLeft = cc.tween().by(this.movementTime, { x: -this.moveX });
        var turnRight = cc.tween().to(0, { scaleX: -1 });
        var moveRight = cc.tween().by(this.movementTime, { x: this.moveX });
        var turnLeft = cc.tween().to(0, { scaleX: 1 });

        var tween = cc.tween().sequence(moveLeft, turnRight, moveRight, turnLeft);
        return cc.tween().repeatForever(tween);
    }
}
