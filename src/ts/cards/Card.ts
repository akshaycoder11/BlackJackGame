

import { Sprite, Texture, Resource } from "pixi.js";
export class Card extends Sprite {
    protected id: string;
    protected value: number = 0;
    constructor(texture: Texture<Resource> | undefined, id: string) {
        super(texture);
        this.id = id;
        this.identifyValue();
        this.scale.set(0.3, 0.3);
        this.x=-150;
        this.y=-150;
    }
    protected identifyValue(): void {
        const face: string = this.id.split("_")[0];
        if (["10", "J", "Q", "K"].indexOf(face) != -1) {
            this.value = 10;
        } else if (face == "A") {
            this.value = 11;
        } else {
            this.value = Number(face)
        }
    }
    public getFaceValue(): number {
        return this.value;
    }
    public getId(): string {
        return this.id;
    }
    public kill(): void {
        this.parent.removeChild(this);
        this.destroy();
    }
}