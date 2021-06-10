// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import MainControl from './MainControl';
import { GameStatus } from './MainControl';
import { SoundType } from './AudioSourceControl';

const { ccclass, property } = cc._decorator;

@ccclass
export default class BirdControl extends cc.Component {
    //Speed of bird
    speed: number = 0;

    // assign of main Control component
    mainControl: MainControl = null;

    onLoad() {
        this.node.parent.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.mainControl = this.node.parent.getComponent('MainControl');
        this.loadSkin();
    }

    start() {}

    onTouchStart(event: cc.Event.EventTouch) {
        this.mainControl.audioSourceControl.playSound(SoundType.E_Sound_Fly);
        this.speed = 2;
    }

    update(dt: number) {
        if (this.mainControl.gameStatus !== GameStatus.Game_Playing) {
            return;
        }

        this.speed -= 0.05;
        const y = this.node.y + this.speed;
        this.node.y = Math.max(-256, y);
        // this.node.y = y;

        var angle = -(this.speed / 2) * 30;
        if (angle >= 30) {
            angle = 30;
        }

        this.node.rotation = angle;
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        switch (other.tag) {
            case 2:
            case 4:
            case 5:
                this.gameOver(other, self);
                break;
            case 1:
                // collider tag is 1, that means the bird cross a pipe, then add score
                this.mainControl.increaseScore();
                break;
        }
    }

    gameOver(other: cc.Collider, self: cc.Collider) {
        //game over
        cc.log('game over');
        this.mainControl.showCollision(other, self);
        this.mainControl.gameOver();
        this.speed = 0;
    }

    loadSkin() {
        const skinIndex = parseInt(cc.sys.localStorage.getItem('SelectedSkin'));
        let animName = '';
        switch (skinIndex) {
            case 2:
            case 17:
                animName = 'BirdSkin02';
                break;
            default:
                animName = 'BirdSkin01';
                break;
        }

        const anim = this.node.getComponent(cc.Animation);
        cc.loader.loadRes(`Animation/${animName}`, function (err, clip) {
            const clips = anim.getClips();
            anim.removeClip(clips[0]);

            anim.addClip(clip);
            anim.currentClip = clip;
            anim.defaultClip = clip;
            anim.play(animName);
        });
    }
}
