

import { IEvent } from "./IEvent";

export class Event implements IEvent {
    public type: string;
    public data: any;
    public target: any;
    constructor(type: string, data?: any) {
        this.type = type;
        this.data = data;
    }
}