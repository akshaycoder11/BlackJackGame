


import { Sprite, Texture, Resource, IHitArea, Rectangle, Assets, Graphics, RoundedRectangle, Circle, Polygon } from "pixi.js";
import { IObject } from "../../core/IObject";

export class Button extends Sprite {
    protected json: IObject;
    protected isdown: boolean = false;
    protected isOver: boolean = false;
    constructor(componentData: IObject) {
        super(Assets.get(componentData.frames.up));
        this.json = componentData;
        this.interactive = true;
        this.cursor = 'pointer';
        this.hitArea = new Rectangle(componentData.hitArea.x, componentData.hitArea.y, componentData.hitArea.w, componentData.hitArea.h);
        if (componentData.hitArea.visible) {
            const ha: Graphics = new Graphics();
            ha.beginFill(0xffff, 1);
            ha.drawRect(componentData.hitArea.x, componentData.hitArea.y, componentData.hitArea.w, componentData.hitArea.h);
            ha.endFill();
            this.addChild(ha);
        }

        this.createButton();
    }
    protected createButton(): void {
        this.on('pointerdown', this.onButtonDown, this)
            .on('pointerup', this.onButtonUp, this)
            .on('pointerupoutside', this.onButtonUp, this)
            .on('pointerover', this.onButtonOver, this)
            .on('pointerout', this.onButtonOut, this);
    }
    protected onButtonDown(): void {
        this.isdown = true;
        this.texture = Assets.get(this.json.frames.down);
        this.alpha = 1;
    }
    protected onButtonUp(): void {
        this.isdown = false;
        if (this.isOver) {
            this.texture = Assets.get(this.json.frames.over);
        } else {
            this.texture = Assets.get(this.json.frames.up);
        }
    }
    protected onButtonOver(): void {
        this.isOver = true;
        if (this.isdown) {
            return;
        }
        this.texture = Assets.get(this.json.frames.over);

    }
    protected onButtonOut(): void {
        this.isOver = false;
        if (this.isdown) {
            return;
        }
        this.texture = Assets.get(this.json.frames.out);;
    }
    public disableButton(): void {
        this.interactive = false;
    }
    public enableButton(): void {
        this.interactive = true;
    }
}