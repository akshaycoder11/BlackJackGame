

import { IObject } from "../core/IObject";
import { IEvent } from "./IEvent";

export interface IEventObject extends IObject {
    handler: (evt: IEvent) => void;
    scope: any;
    once: boolean;
    priority: number;
}