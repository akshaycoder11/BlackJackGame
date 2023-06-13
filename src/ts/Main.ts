
import { Application, Assets, Sprite, Spritesheet, Text } from "pixi.js";
import { Constants } from "./lib/Constants";
import { MyGame } from "./lib/core/GlobalConstants";
import { EventSystem } from "./lib/eventSystem/EventSystem";
import { Loading } from "./lib/loading/Loading";
import { BaseGameView } from "./baseGame/view/BaseGameView";
import { PostIntroView } from "./postIntro/view/PostIntroView";
import { PostIntroController } from "./postIntro/Controller/PostIntroController";
import { BaseGameModel } from "./baseGame/model/BaseGameModel";
import { BaseGameController } from "./baseGame/controller/BaseGameController";
import { Group, Tween } from "tweedle.js";

export class MainGame {
    private canvas: HTMLCanvasElement;
    private game: Application;
    protected isbaseGameAssetsLoaded: boolean = false;
    protected showBaseGame: boolean = false;
    protected postIntroView!:PostIntroView;
    constructor() {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        MyGame.game = this.game = new Application({ view: this.canvas, backgroundColor: 0xBCE5FF, width: 1280, height: 768, antialias: true });
        //@ts-expect-error
        globalThis.__PIXI_APP__ = this.game  //this is used for pixjs tool;
        EventSystem.addEventListener(Constants.LOADING_COMPLETED, this.initializePostIntro, this, true);
        EventSystem.addEventListener(Constants.BASEGAME_LOADING_COMPLETED, this.onBaseGameAssetsLoaded, this, true);
        EventSystem.addEventListener(Constants.SHOW_BASEGAME, this.onShowBaseGame, this, true);
        const loading: Loading = new Loading("res/manifest/mainManifest.json");
        loading.init();
    }
    private initializePostIntro(): void {
        this.postIntroView= new PostIntroView(Assets.get("loading").PostIntro);
        const postintrocontroller: PostIntroController = new PostIntroController(this.postIntroView);
        MyGame.game?.stage.addChild(this.postIntroView);
    

    }
    private onBaseGameAssetsLoaded() {
        this.isbaseGameAssetsLoaded = true;
        this.initializeBaseGame();
    }
    protected onShowBaseGame() {
        this.showBaseGame = true;
        this.initializeBaseGame();
    }
    protected initializeBaseGame(): void {
        if (this.isbaseGameAssetsLoaded && this.showBaseGame) {
            this.isbaseGameAssetsLoaded = false;
            this.showBaseGame = false;
            const basegameview: BaseGameView = new BaseGameView(Assets.get("loading").BaseGame);
            const basegamemodel: BaseGameModel = new BaseGameModel();
            MyGame.baseGameModel=basegamemodel;
            const basegameController: BaseGameController = new BaseGameController(basegameview, basegamemodel);
            MyGame.game?.stage.addChild(basegameview);
            this.removePostIntroView();
        }
    }

    protected removePostIntroView() {
        this.postIntroView.destroy();
    }


}
new MainGame();