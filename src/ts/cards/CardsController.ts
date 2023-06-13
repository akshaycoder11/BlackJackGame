import { Assets, Container, Text } from "pixi.js";
import { BaseGameModel } from "../baseGame/model/BaseGameModel";
import { BaseGameView } from "../baseGame/view/BaseGameView";
import { CardFactory } from "./CardFactory";
import { CardsManager } from "./CardsManager";
import { EventSystem } from "../lib/eventSystem/EventSystem";
import { GameConstants } from "../lib/GameConstants";
import { Button } from "../lib/views/ui/Button";

export class CardsController {
    protected cardFactory!: CardFactory;
    public cardsManager!: CardsManager;
    protected dealerMtr!: Text;
    protected playerMtr!: Text;
    protected hitBtn!: Button;
    protected standBtn!: Button;
    protected playerAndDealerMtrContainer!: Container;
    protected view: BaseGameView;
    protected model: BaseGameModel;
    constructor(view: BaseGameView, model: BaseGameModel) {
        this.view = view;
        this.model = model;
        this.initialize();
        this.initializeCardFactory()
        this.initializeCardManager();
        this.updatePlayerDealerMtr();
        EventSystem.addEventListener(GameConstants.ON_DEAL_CLICKED, this.onDealClicked, this);
        EventSystem.addEventListener(GameConstants.UPDATE_PLAYER_DEALER_MTR, this.updatePlayerDealerMtr, this);
        EventSystem.addEventListener(GameConstants.RESET_ALL, this.reset, this)
    }
    protected initialize() {
        this.playerMtr = this.view.getComponentByID("playerMeter") as Text;
        this.dealerMtr = this.view.getComponentByID("dealerMeter") as Text;
        this.playerAndDealerMtrContainer = this.view.getComponentByID("playerAndDealerMtrContainer") as Container;
        this.hitBtn = this.view.getComponentByID("hitButton") as Button;
        this.standBtn = this.view.getComponentByID("standButton") as Button;
        this.hitBtn.onclick = this.onHitBtnPressup.bind(this);
        this.standBtn.onclick = this.onStandBtnPressup.bind(this);
    }
    protected initializeCardFactory() {
        this.cardFactory = new CardFactory(Assets.get("loading").cards)
    }
    protected initializeCardManager() {
        this.cardsManager = new CardsManager(this.view, this.cardFactory);
    }
    protected onDealClicked() {
        this.cardsManager.drawFirstTwoCards();
        this.playerAndDealerMtrContainer.visible = true;
    }
    protected updatePlayerDealerMtr() {
        this.playerMtr.text = String(this.cardsManager.getPlayerScore());
        this.dealerMtr.text = String(this.cardsManager.getDealerScore());
    }
    protected onHitBtnPressup() {
        this.cardsManager.drawCardForPlayer(0);
    }
    protected onStandBtnPressup() {
        this.cardsManager.isPlayerDone = true;
        this.cardsManager.flipDealerFirstCard();

    }
    protected reset() {
        this.playerAndDealerMtrContainer.visible = false;
        this.cardsManager.hitAndStandBtnContainer.visible = false;
    }
}