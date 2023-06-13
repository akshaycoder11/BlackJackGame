
import { Container, DisplayObject, Sprite, Text } from "pixi.js";
import { ChipsController } from "../../chips/ChipsController";
import { MyGame } from "../../lib/core/GlobalConstants";
import { BaseGameModel } from "../model/BaseGameModel";
import { BaseGameView } from "../view/BaseGameView";
import { EventSystem } from "../../lib/eventSystem/EventSystem";
import { GameConstants } from "../../lib/GameConstants";
import { Button } from "../../lib/views/ui/Button";
import { Easing, Tween } from "tweedle.js";
import { GameTween, TweenData } from "../../lib/tween/GameTween";
import { CardsController } from "../../cards/CardsController";
export class BaseGameController {
    protected view: BaseGameView;
    protected model: BaseGameModel;
    protected chipBankContainer!: Container;
    protected placingBetConatiner!: Container;
    protected winpresentaionContainer!: Container;
    protected betMtrContainer!: Container;
    protected betMtr!: Text;
    protected showChipbankforBet: boolean = true;
    protected dealBtn!: Button;
    protected cardController!: CardsController;
    protected playerWon!: Sprite;
    protected dealerWon!: Sprite;
    protected playerBust!: Sprite;
    protected dealerBust!: Sprite;
    protected shuffleCards!: Sprite;
    protected deckSizeMtr!: Text;
    private movingSpeed: number = 10;
    constructor(view: BaseGameView, model: BaseGameModel) {
        this.view = view;
        this.model = model;
        this.initialize();
        this.initializeChipsController();
        this.initializeCardsController();           /* this class is used for controlling other classes */
        this.showAndHideChipBank();
        this.updateDealBtnVisibilty();
    }
    protected initializeChipsController() {
        new ChipsController(this.view, this.model);
    }
    protected initializeCardsController() {
        this.cardController = new CardsController(this.view, this.model);
    }
    protected initialize() {
        this.chipBankContainer = this.view.getComponentByID("chipBankContainer") as Container;
        this.placingBetConatiner = this.view.getComponentByID("placingBetContainer") as Container;
        this.betMtrContainer = this.view.getComponentByID("betMtrContainer") as Container;
        this.winpresentaionContainer = this.view.getComponentByID("winPresentaionContainer") as Container;
        this.playerBust = this.view.getComponentByID("playerBust") as Sprite;
        this.dealerBust = this.view.getComponentByID("dealerBust") as Sprite;
        this.playerWon = this.view.getComponentByID("playerWin") as Sprite;
        this.dealerWon = this.view.getComponentByID("dealerWin") as Sprite;
        this.shuffleCards = this.view.getComponentByID("shuffle") as Sprite
        this.betMtr = this.view.getComponentByID("totalBetMeter") as Text;
        this.deckSizeMtr = this.view.getComponentByID("deckSizeMeter") as Text;
        this.dealBtn = this.view.getComponentByID("PlaceDealBtn") as Button;
        this.placingBetConatiner.onclick = this.rePlacingBet.bind(this);
        this.placingBetConatiner.interactive = true;
        this.dealBtn.onclick = this.onDealBtnPressup.bind(this);
        EventSystem.addEventListener(GameConstants.UPDATE_DEAL_BTN_VISIBILITY, this.updateDealBtnVisibilty, this)
        EventSystem.addEventListener(GameConstants.SHOW_AND_HIDE_CHIP_BANK, this.showAndHideChipBank, this);
        EventSystem.addEventListener(GameConstants.SHOW_WIN_PRESENTAION, this.showWinPresentaion, this);
        EventSystem.addEventListener(GameConstants.UPDATE_DECK_SIZE_MTR, this.updateDeckSizeMtr, this);
    }
    protected showWinPresentaion() {
        this.cardController.cardsManager.hitAndStandBtnContainer.visible = false;
        this.winpresentaionContainer.visible = true;
        if (this.cardController.cardsManager.isPlayerBust) {
            this.playerBust.visible = true;
            this.dealerWon.visible = true;
        } else if (this.cardController.cardsManager.isDealerBust) {
            this.dealerBust.visible = true;
            this.playerWon.visible = true;
        } else if (MyGame.baseGameModel.getIsPlayerWon()) {
            this.playerWon.visible = true;                        // this function is used for showing win at last //
        } else {
            this.dealerWon.visible = true;
        }
        if (this.cardController.cardFactory.getDeckSize() <= 10) {
            window.setTimeout(() => {
                this.playerWon.visible = false;
                this.dealerWon.visible = false;
                this.playerBust.visible = false;
                this.dealerBust.visible = false;
                this.shuffleCards.visible = true;
                this.cardController.cardFactory.shuffleAllCards();
                this.updateDeckSizeMtr();
            }, 1500);
            window.setTimeout(() => {
                this.winpresentaionContainer.visible = false;
                this.playerWon.visible = false;
                this.dealerWon.visible = false;
                this.playerBust.visible = false;
                this.dealerBust.visible = false;
                this.shuffleCards.visible = false;
            }, 2500)
        } else {
            window.setTimeout(() => {
                this.winpresentaionContainer.visible = false;
                this.playerWon.visible = false;
                this.dealerWon.visible = false;
                this.playerBust.visible = false;
                this.dealerBust.visible = false;
            }, 2000)
        }

    }
    protected updateDeckSizeMtr() {
        this.deckSizeMtr.text=String(this.cardController.cardFactory.getDeckSize());
    }
    public updateDealBtnVisibilty() {
        if (this.model.getBetAmount()) {
            this.dealBtn.visible = true;
            this.betMtrContainer.visible = true;
            this.betMtr.text = String(`$${this.model.getBetAmount()}`);
        } else {
            this.dealBtn.visible = false;
            this.betMtrContainer.visible = false;
        }
    }
    protected onDealBtnPressup() {
        this.dealBtn.visible = false;
        this.showAndHideChipBank();
        EventSystem.dispatch(GameConstants.ON_DEAL_CLICKED);
    }
    protected rePlacingBet() {
        EventSystem.dispatch(GameConstants.REPLACE_BET_CLICKED);
    }
    protected showAndHideChipBank() {
        var tween: Tween<DisplayObject>;
        if (this.showChipbankforBet) {
            const tweenData: TweenData = {
                properties: { y: 0 },
                duration: 500,
                ease: Easing.Linear.None,
            };
            tween = GameTween.addTween(this.chipBankContainer, tweenData, () => {
                GameTween.clearTween(tween);
            })
            this.showChipbankforBet = false;
            this.placingBetConatiner.interactive = true;                      // this function is used for chip bank movement
        } else {
            this.showChipbankforBet = true;
            this.placingBetConatiner.interactive = true;
            const tweenData: TweenData = {
                properties: { y: 205 },
                duration: 500,
                ease: Easing.Linear.None,
            };
            tween = GameTween.addTween(this.chipBankContainer, tweenData, () => {
                GameTween.clearTween(tween);
            })
        }
    }



}
