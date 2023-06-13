

import { Sprite, Texture, Resource } from "pixi.js";
export class Chip extends Sprite {
    protected id: string;
    protected value: number = 0;
    public movingspeed:number=30;
    public movingforplacingbet:boolean=true;
    public bank_chip_x!:number;
    public bank_chip_y!:number;
    constructor(texture: Texture<Resource> | undefined, id: string) {
        super(texture);
        this.id = id;
        this.scale.set(0.2);
        this.identifyValue();
    }
    protected identifyValue(): void {
        this.value = Number(this.id)
    }

    // above function is used for storing chip value
    
    public kill(): void {
        this.parent.removeChild(this);
        this.destroy();
    }
}