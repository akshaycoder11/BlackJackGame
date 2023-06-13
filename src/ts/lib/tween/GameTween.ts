import { Tween } from "tweedle.js";
import { IObject } from "../core/IObject";
import { DisplayObject } from "pixi.js";
import { EasingFunction } from "tweedle.js";
import { MyGame } from "../core/GlobalConstants";
export interface TweenData {
    properties?: IObject;
    duration: number;
    ease: EasingFunction;
    autoStart?: boolean;
    delay?: number;
    repeat?: number;
    yoyo?: boolean;
}
export class GameTween {
    protected static allTween: Tween<DisplayObject>[] = [];
    public static addTween(tweenTarget: DisplayObject, tweenData: TweenData, callback?: Function) {
        const tween = new Tween(tweenTarget).to(tweenData.properties, tweenData.duration);
        tweenData.repeat && tween.repeat(tweenData.repeat);
        tweenData.yoyo && tween.yoyo(tweenData.yoyo);
        tween.easing(tweenData.ease)
        tween.start(tweenData.delay);
        MyGame.game?.ticker.add(() => tween.update(MyGame.game?.ticker.deltaMS as number));
        tween.onComplete(() => {callback&&callback()});
        this.allTween.push(tween);
        return tween;
    }
    public static clearTween(tween: Tween<DisplayObject>) {
        for (let i = 0; i < this.allTween.length; i++) {
            if (this.allTween[i] == tween) {
                this.allTween[i].stop();
            }
        }
    }
}