
import { IObject } from "../../lib/core/IObject";
import { BaseView } from "../../lib/views/BaseView";

export class BaseGameView extends BaseView {
    constructor(viewjson: IObject) {
        super(viewjson);
    }
}