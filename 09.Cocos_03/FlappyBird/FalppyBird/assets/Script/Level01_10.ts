// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    level01: cc.Button = null;
    level01Scene: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.level01 = this.node.getChildByName('Level01').getComponent(cc.Button);
        this.level01.node.on(cc.Node.EventType.TOUCH_START, this.startLevel01, this);

        this.node
            .getChildByName('Level02')
            .getComponent(cc.Button)
            .node.on(cc.Node.EventType.TOUCH_START, this.startLevel02, this);

        this.node
            .getChildByName('Shop')
            .getComponent(cc.Button)
            .node.on(cc.Node.EventType.TOUCH_START, this.shop, this);
    }

    start() {}

    // update (dt) {}
    startLevel01() {
        cc.loader.loadRes('Prefab/Level01', (err, prefab) => {
            var currentSceen = cc.director.getScene();
            this.node.removeAllChildren(true);
            // var canv = currentSceen.getChildByName('Canvas');
            // canv.destroy();

            var newNode = cc.instantiate(prefab);
            this.node.addChild(newNode);
            this.level01Scene = newNode;
            this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        });
    }

    onTouchStart(event: cc.Event.EventTouch) {
        if (!!this.level01Scene) {
            this.node.getComponentInChildren('BirdControl').onTouchStart(event);
        }
    }

    startLevel02() {
        cc.director.loadScene('level-02');
    }

    shop() {
        cc.director.loadScene('shop');
    }
}
