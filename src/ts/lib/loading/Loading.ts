

import { Assets } from "pixi.js"
import { Constants } from "../Constants";
import { EventSystem } from "../eventSystem/EventSystem";
export class Loading {
    constructor(mainManifestURL: string) {
        Assets.add("mainManifest", mainManifestURL);
    }
    public init(): void {
        Assets.load("mainManifest").then(this.mainManifestLoaded.bind(this));
    }
    private async mainManifestLoaded(): Promise<void> {
        const manifestData: any = Assets.get("mainManifest");
        Assets.addBundle("loading", manifestData["loading"]);
        Assets.loadBundle("loading").then(this.onLoadingCompleted.bind(this))
    }
    private onLoadingCompleted(): void {
        EventSystem.dispatch(Constants.LOADING_COMPLETED);  
        this.loadBaseGameAssets();
    }
    private loadBaseGameAssets(){
        const manifestData: any = Assets.get("mainManifest");
        Assets.addBundle("baseGame", manifestData["baseGame"]);
        Assets.loadBundle("baseGame").then(this.onBaseGameAssetsLoaded.bind(this))
    }

    private onBaseGameAssetsLoaded(){
        EventSystem.dispatch(Constants.BASEGAME_LOADING_COMPLETED);  
    }
}