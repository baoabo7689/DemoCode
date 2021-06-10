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
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node
            .getChildByName('Back')
            .getComponent(cc.Button)
            .node.on(cc.Node.EventType.TOUCH_START, this.back, this);

        const numberOfSkin = 17;
        for (let i = 1; i <= numberOfSkin; i++) {
            cc.find(`Canvas/BirdSkin/view/content/Skin${i < 10 ? '0' + i : i}`).on(
                cc.Node.EventType.TOUCH_START,
                () => this.chooseSkin(i),
                this,
            );
        }

        this.updateSelectedSkin();
    }

    start() {}

    // update (dt) {}
    back() {
        cc.director.loadScene('level-01-10');
    }

    chooseSkin(skinIndex: number) {
        this.removeSelectedSkin();
        cc.sys.localStorage.setItem('SelectedSkin', skinIndex);
        this.updateSelectedSkin();
    }

    removeSelectedSkin() {
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

        const item = cc.find(
            `Canvas/BirdSkin/view/content/Skin${skinIndex < 10 ? '0' + skinIndex : skinIndex}`,
        );

        const anim = item.getComponent(cc.Animation);
        cc.loader.loadRes(`Animation/${animName}`, function (err, clip) {
            const clips = anim.getClips();
            anim.removeClip(clips[0]);

            anim.addClip(clip);
            anim.currentClip = clip;
            anim.defaultClip = clip;
            anim.play(animName);
        });
    }

    updateSelectedSkin() {
        const skinIndex = parseInt(cc.sys.localStorage.getItem('SelectedSkin'));
        let animName = '';
        switch (skinIndex) {
            case 2:
            case 17:
                animName = 'HightlightedBird02';
                break;
            default:
                animName = 'HightlightedBird01';
                break;
        }

        const item = cc.find(
            `Canvas/BirdSkin/view/content/Skin${skinIndex < 10 ? '0' + skinIndex : skinIndex}`,
        );

        const anim = item.getComponent(cc.Animation);
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
