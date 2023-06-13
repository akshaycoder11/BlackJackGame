import { Assets, Container, DisplayObject, Text } from "pixi.js";
import { BaseGameModel } from "../baseGame/model/BaseGameModel";
import { BaseGameView } from "../baseGame/view/BaseGameView";
import { Button } from "../lib/views/ui/Button";
import { IEvent } from "../lib/eventSystem/IEvent";
import { ChipsFactory } from "./ChipsFactory";
import { Chip } from "./Chip";
import { MyGame } from "../lib/core/GlobalConstants";
import { EventSystem } from "../lib/eventSystem/EventSystem";
import { GameConstants } from "../lib/GameConstants";
import { BaseGameController } from "../baseGame/controller/BaseGameController";
import { Easing, Tween } from "tweedle.js";
import { GameTween, TweenData } from "../lib/tween/GameTween";

export class ChipsController {
    protected view: BaseGameView;
    protected model: BaseGameModel;
    protected bankBalnceMtr!: Text;
    protected placingBetConatiner!: Container;
    protected chipFactory!: ChipsFactory;
    protected movingTweensContainer: Chip[] = [];
    protected chipsBtnArray: Button[] = [];
    private chipBtnValues: number[] = [1, 2, 5, 10, 25]
    constructor(view: BaseGameView, model: BaseGameModel) {
        this.view = view;
        this.model = model;
        this.initialize();
        this.initializeChipFactory();
    }
    protected initialize() {
        this.bankBalnceMtr = this.view.getComponentByID("totalBankBalanceMeter") as Text;
        this.placingBetConatiner = this.view.getComponentByID("placingBetContainer") as Container;
        for (let i = 0; i < this.chipBtnValues.length; i++) {
            this.chipsBtnArray.push(this.view.getComponentByID(`ChipBtn_${this.chipBtnValues[i]}`) as Button);
            this.chipsBtnArray[i].onclick = this.onChipsSelected.bind(this,);
        }
        EventSystem.addEventListener(GameConstants.REPLACE_BET_CLICKED, this.rePlacingBet, this);
        EventSystem.addEventListener(GameConstants.RESET_ALL, this.reset, this);
        this.updateChips();
    }
    protected initializeChipFactory() {
        this.chipFactory = new ChipsFactory(Assets.get("loading").chips);
    }
    protected onChipsSelected(evt?: IEvent) {
        const tempChip: Chip = this.chipFactory.getChipByValue(evt?.target.json.id);
        this.model.setBankBalance(this.model.getBankBalance() - Number(evt?.target.json.id.split("_")[1]));
        this.model.setBetAmount(this.model.getBetAmount() + Number(evt?.target.json.id.split("_")[1]));
        tempChip.movingforplacingbet = true;
        tempChip.x = tempChip.bank_chip_x = evt?.target.json.x;
        tempChip.y = tempChip.bank_chip_y = evt?.target.json.y;
        this.updateChips();
        this.placingBet(tempChip);
        EventSystem.dispatch(GameConstants.UPDATE_DEAL_BTN_VISIBILITY);
    }
        // above function is for selecting chips from chip bank for placing bet

    protected placingBet(chip: Chip) {
        MyGame.game?.stage.addChild(chip);
        var tween: Tween<DisplayObject>;
        const tweenData: TweenData = {
            properties: { x: 500, y: 350 },
            duration: 500,
            ease: Easing.Quadratic.In,
        };
        tween = GameTween.addTween(chip, tweenData, () => {
            chip.movingforplacingbet = false;
            chip.x = 0;
            chip.y = 0;
            this.placingBetConatiner.addChild(chip);
        });
    }

    // above function is for placing chips for bet on table

    protected rePlacingBet() {
        if (!this.placingBetConatiner.children.length)
            return;
        const removeChild: any = this.placingBetConatiner.children.pop();
        MyGame.game?.stage.addChild(removeChild);
        this.model.setBankBalance(this.model.getBankBalance() + Number(removeChild.value));
        this.model.setBetAmount(this.model.getBetAmount() - removeChild.value);
        removeChild.x = 500;
        removeChild.y = 350;
        var tween: Tween<DisplayObject>;
        const tweenData: TweenData = {
            properties: { x: removeChild.bank_chip_x, y: removeChild.bank_chip_y },
            duration: 500,
            ease: Easing.Quadratic.In,
        };
        tween = GameTween.addTween(removeChild, tweenData, () => {
            this.chipFactory.removeChild(removeChild);
            removeChild.kill();
        });
        this.updateChips();
        EventSystem.dispatch(GameConstants.UPDATE_DEAL_BTN_VISIBILITY);
    }

    // above function is for replace/change chips before dealing

    protected updateChips() {
        for (let i = 0; i < this.chipsBtnArray.length; i++) {
            this.chipsBtnArray[i].visible = false;
        }
        var chipsvisible: number = 0;
        var bankBalance: number = this.model.getBankBalance();
        this.bankBalnceMtr.text = String(`$${bankBalance}`);
        if (bankBalance >= 25) {
            chipsvisible = 5;
        } else if (bankBalance >= 10) {
            chipsvisible = 4;
        } else if (bankBalance >= 5) {
            chipsvisible = 3;
        } else if (bankBalance >= 2) {
            chipsvisible = 2;
        } else if (bankBalance >= 1) {
            chipsvisible = 1;
        }
        for (let i = 0; i < chipsvisible; i++) {
            this.chipsBtnArray[i].visible = true;
        }
    }

    //above function is used for updating chips bank as per your balance

    protected reset() {
        let tempx, tempy;
        if (this.model.getIsPlayerWon()) {
            this.model.setBankBalance(this.model.getBankBalance() + 2*this.model.getBetAmount());
            this.updateChips();
            tempx = -5;
            tempy = 700;
        } else {
            tempx = -5;
            tempy = -200;
        }
        this.model.setBetAmount(0);
        this.model.setIsPlayerWon(false);
        let i=0;
        while (this.placingBetConatiner.children.length) {
            const removeChild: any = this.placingBetConatiner.children.pop();
            MyGame.game?.stage.addChild(removeChild);
            removeChild.x = 500;
            removeChild.y = 350;
            var tween: Tween<DisplayObject>;
            const tweenData: TweenData = {
                properties: { x: tempx, y: tempy },
                duration: 500,
                delay:100*i,
                ease: Easing.Quadratic.In,
            };
            i++;
            tween = GameTween.addTween(removeChild, tweenData, () => {
                this.chipFactory.removeChild(removeChild);
                removeChild.kill();
            });
        }
    }

    //above function is called for reset when that gameplay finished
}