
import { IObject } from "../lib/core/IObject";
import { Chip } from "./Chip";
import { Application, Assets, Sprite, Spritesheet } from "pixi.js";

export class ChipsFactory {
    protected allChips: Chip[] = [];
    protected chipData: IObject;
    constructor(chipData: IObject) {
        this.chipData = chipData;
    }
    public getChipByValue(value: string): Chip {
        const chip: Chip = new Chip(Assets.get(`${value.split("_")[1]}_casino-chip.png`),`${value.split("_")[1]}`);
        this.allChips.push(chip);
        return chip;
    }
    public clearAll(): void {
        this.allChips.forEach((chip: Chip)=>{
            chip.kill();
        });
        this.allChips = [];
    }
    public removeChild(value:Chip){
        for(let i=0;i<this.allChips.length;i++){
            if(this.allChips[i]==value){
                this.allChips.splice(i,1);
            }
        }
        
    }
}