

import { Container, DisplayObject, Sprite, Assets, Text, IDestroyOptions } from "pixi.js";
import { MyGame } from "../core/GlobalConstants";
import { IObject } from "../core/IObject";
import { Button } from "./ui/Button";
export abstract class BaseView extends Container {
    protected viewJson: IObject;
    protected allComponents: Map<string, DisplayObject> = new Map<string, DisplayObject>();
    constructor(viewjson: IObject) {
        super()
        this.viewJson = viewjson;
        this.createDisplayHeirachy();
    }
    protected createDisplayHeirachy(): void {
        for (const index in this.viewJson) {
            if (this.viewJson.hasOwnProperty(index)) {
                const obj = this.viewJson[index];
                if (!obj.type) {
                    continue;
                }
                this.createComponents(obj);
            }
        }
    }
    protected createComponents(componentData: IObject): void {
        switch (componentData.type.toLowerCase()) {
            case "container":
                this.createContainer(componentData);
                break;
            case "image":
                this.createImage(componentData);
                break;
            case "button":
                this.createButton(componentData);
                break;
            case "text":
                this.createText(componentData);
                break;
        }
    }
    protected createText(componentData: IObject): Text {
        const text: Text = new Text(componentData.text, componentData.style);
        text.name = componentData.id;
        text.x = componentData.x;
        text.y = componentData.y;
        text.visible = componentData.visible;
        text.scale.set(componentData.scaleX || 1, componentData.scaleY || 1);
        this.allComponents.set(componentData.id, text);
        if (componentData.parent && componentData.parent != "") {
            if (this.getComponentByID(componentData.parent)) {
                (this.getComponentByID(componentData.parent) as Container).addChild(text);
            } else {
                throw new Error(`Parent not defined - ${componentData.parent}`);
            }
        } else {
            this.addChild(text);
        }
        return text;

    }
    protected createButton(componentData: IObject): Button {
        const button: Button = new Button(componentData);
        button.name = componentData.id;
        button.x = componentData.x;
        button.y = componentData.y;
        button.visible = componentData.visible;
        button.scale.set(componentData.scaleX || 1, componentData.scaleY || 1);
        this.allComponents.set(componentData.id, button);
        if (componentData.parent && componentData.parent != "") {
            if (this.getComponentByID(componentData.parent)) {
                (this.getComponentByID(componentData.parent) as Container).addChild(button);
            } else {
                throw new Error(`Parent not defined - ${componentData.parent}`);
            }
        } else {
            this.addChild(button);
        }
        return button;
    }
    protected createImage(componentData: IObject): Sprite {
        let image: Sprite = new Sprite(Assets.get(componentData.texture));
        image.name = componentData.id;
        image.x = componentData.x;
        image.y = componentData.y;
        image.visible = componentData.visible;
        image.scale.set(componentData.scaleX || 1, componentData.scaleY || 1);
        this.allComponents.set(componentData.id, image);
        if (componentData.parent && componentData.parent != "") {
            if (this.getComponentByID(componentData.parent)) {
                (this.getComponentByID(componentData.parent) as Container).addChild(image);
            } else {
                throw new Error(`Parent not defined - ${componentData.parent}`);
            }
        } else {
            this.addChild(image);
        }
        return image;
    }
    protected createContainer(componentData: IObject): Container {
        let container: Container;
        container = new Container();
        container.name = componentData.id;
        this.allComponents.set(componentData.id, container);
        if (componentData.parent && componentData.parent != "") {
            if (this.getComponentByID(componentData.parent)) {
                (this.getComponentByID(componentData.parent) as Container).addChild(container);
            } else {
                throw new Error(`Parent not defined - ${componentData.parent}`);
            }
        } else {
            this.addChild(container);
        }
        container.x = componentData.x;
        container.y = componentData.y;
        container.visible = componentData.visible;
        return container;
    }
    public getComponentByID(id: string): DisplayObject | undefined {
        return this.allComponents.get(id);
    }
    public destroy(options?: boolean | IDestroyOptions | undefined): void {
        this.parent.removeChild(this);
        super.destroy(options);
    }
}