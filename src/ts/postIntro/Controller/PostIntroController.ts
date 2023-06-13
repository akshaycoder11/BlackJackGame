import { Container } from "pixi.js";
import { PostIntroView } from "../view/PostIntroView";
import { Button } from "../../lib/views/ui/Button";
import { EventSystem } from "../../lib/eventSystem/EventSystem";
import { Constants } from "../../lib/Constants";

export class PostIntroController{
    protected view: PostIntroView;
    protected postIntroContainer!: Container;
    protected postIntroButton!: Button;
    constructor(view:PostIntroView){
        this.view=view;
        this.initialize();
    }
    protected initialize() {
        this.postIntroContainer = this.view.getComponentByID("PostIntroContainer") as Container;
    //    ( this.view.getComponentByID("mainContainer") as Container).addChild(this.loadingIntroContainer);
        this.postIntroButton = this.view.getComponentByID("PostIntroButton") as Button;
        this.postIntroButton.onclick=this.onLoadingPlayBtnPressed.bind(this);
    }
    protected onLoadingPlayBtnPressed() {
        this.postIntroContainer.visible=false;
        EventSystem.dispatch(Constants.SHOW_BASEGAME);  
    }

}