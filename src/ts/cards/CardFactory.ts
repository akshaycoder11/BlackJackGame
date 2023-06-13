

import { IObject } from "../lib/core/IObject";
import { Card } from "./Card";
import { Application, Assets, Sprite, Spritesheet } from "pixi.js";

export class CardFactory {
    private deck: string[] = [];
    private cardData: IObject;
    constructor(cardData: IObject) {
        this.cardData = cardData;
        this.initializeDeck();
    }
    protected initializeDeck(): void {
        this.deck = ["A_OF_Clubs", "2_OF_Clubs", "3_OF_Clubs", "4_OF_Clubs", "5_OF_Clubs", "6_OF_Clubs", "7_OF_Clubs", "8_OF_Clubs", "9_OF_Clubs", "10_OF_Clubs", "J_OF_Clubs", "Q_OF_Clubs", "K_OF_Clubs",
            "A_OF_Diamonds", "2_OF_Diamonds", "3_OF_Diamonds", "4_OF_Diamonds", "5_OF_Diamonds", "6_OF_Diamonds", "7_OF_Diamonds", "8_OF_Diamonds", "9_OF_Diamonds", "10_OF_Diamonds", "J_OF_Diamonds", "Q_OF_Diamonds", "K_OF_Diamonds",
            "A_OF_Hearts", "2_OF_Hearts", "3_OF_Hearts", "4_OF_Hearts", "5_OF_Hearts", "6_OF_Hearts", "7_OF_Hearts", "8_OF_Hearts", "9_OF_Hearts", "10_OF_Hearts", "J_OF_Hearts", "Q_OF_Hearts", "K_OF_Hearts",
            "A_OF_Spades", "2_OF_Spades", "3_OF_Spades", "4_OF_Spades", "5_OF_Spades", "6_OF_Spades", "7_OF_Spades", "8_OF_Spades", "9_OF_Spades", "10_OF_Spades", "J_OF_Spades", "Q_OF_Spades", "K_OF_Spades"];
        this.deck = [...this.deck, ...this.deck];
    }
    protected shuffleAllCards(){
        this.initializeDeck()               // currently we are not shuffling the cards
    }
    public getRandomCard(): Card {
        const index: number = Math.floor(Math.random() * this.deck.length);
        const card: Card = new Card(Assets.get(this.cardData[this.deck[index]]), this.deck[index]); // using this function for drawing random card from deck
        this.deck.splice(index, 1);
        return card;
    }
}