// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

import AudioSourceControl, { SoundType } from './AudioSourceControl';

const { ccclass, property } = cc._decorator;

export enum GameStatus {
    Game_Ready = 0,
    Game_Playing,
    Game_Over,
}

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Sprite)
    spBg: cc.Sprite[] = [null, null];

    @property(cc.Prefab)
    pipePrefab: cc.Prefab = null;

    pipe: cc.Node[] = [null, null, null];

    @property(cc.Sprite)
    spGameOver: cc.Sprite = null;

    btnStart: cc.Button = null;
    gameStatus: GameStatus = GameStatus.Game_Ready;

    @property(cc.Label)
    labelScore: cc.Label = null;

    gameScore: number = 0;

    @property(AudioSourceControl)
    audioSourceControl: AudioSourceControl = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //open Collision System
        var collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;
        //open debug draw when you debug the game
        //do not forget to close when you ship the game
        collisionManager.enabledDebugDraw = false;

        // find the GameOver node, and set active property to false
        this.spGameOver = this.node.getChildByName('GameOver').getComponent(cc.Sprite);
        this.spGameOver.node.active = false;

        this.btnStart = this.node.getChildByName('BtnStart').getComponent(cc.Button);
        this.btnStart.node.on(cc.Node.EventType.TOUCH_START, this.touchStartBtn, this);

        this.audioSourceControl = this.node
            .getChildByName('AudioSource')
            .getComponent(AudioSourceControl);
    }

    start() {
        for (let i = 0; i < this.pipe.length; i++) {
            this.pipe[i] = cc.instantiate(this.pipePrefab);
            this.node.getChildByName('Pipe').addChild(this.pipe[i]);

            this.pipe[i].x = 170 + 200 * i;
            var minY = -120;
            var maxY = 120;
            this.pipe[i].y = minY + Math.random() * (maxY - minY);
        }
    }

    update(dt) {
        if (this.gameStatus !== GameStatus.Game_Playing) {
            return;
        }

        // move the background node
        const backgroundWidth = 288;
        for (let i = 0; i < this.spBg.length; i++) {
            this.spBg[i].node.x -= 1.0;
            if (this.spBg[i].node.x <= -backgroundWidth) {
                this.spBg[i].node.x = backgroundWidth;
            }
        }

        // move pipes
        for (let i = 0; i < this.pipe.length; i++) {
            this.pipe[i].x -= 1.0;
            if (this.pipe[i].x <= -170) {
                this.pipe[i].x = 430;

                var minY = -120;
                var maxY = 120;
                this.pipe[i].y = minY + Math.random() * (maxY - minY);
            }
        }
    }

    gameOver() {
        this.spGameOver.node.active = true;
        this.btnStart.node.active = true;
        this.gameStatus = GameStatus.Game_Ready;
        this.audioSourceControl.playSound(SoundType.E_Sound_Die);
    }

    touchStartBtn() {
        this.btnStart.node.active = false;
        this.gameStatus = GameStatus.Game_Playing;
        this.spGameOver.node.active = false;
        for (var i = 0; i < this.pipe.length; i++) {
            this.pipe[i].x = 170 + 200 * i;
            var minY = -120;
            var maxY = 120;
            this.pipe[i].y = minY + Math.random() * (maxY - minY);
        }

        const bird = this.node.getChildByName('Bird');
        bird.y = 0;
        bird.rotation = 0;

        this.gameScore = 0;
        this.labelScore.string = `Score: ${this.gameScore}`;
    }
}
