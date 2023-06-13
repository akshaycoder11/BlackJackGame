
import { IObject } from "../core/IObject";
import { IEvent } from "./IEvent";
import { Event } from "./Event";
import { IEventObject } from "./IEventObject";

export class EventSystem {
    private static allEvents: Map<string, IEventObject[]> = new Map<string, IEventObject[]>();
    constructor() { }
    public static addEventListener(type: string, handler: (evt: IEvent, data?: IObject) => void, scope?: any, once?: boolean, priority?: number): void {
        if (!this.allEvents.has(type)) {
            this.allEvents.set(type, []);
        }
        this.allEvents.get(type)?.push({ handler: handler, scope: scope || window, once: once || false, priority: priority || Number(this.allEvents.get(type)?.length) });
        this.allEvents.get(type)?.sort((a: IEventObject, b: IEventObject) => {
            return a.priority - b.priority;
        });
    }
    public static removeEventListener(type: string, handler: (evt: IEvent) => void): void {
        if (this.allEvents.has(type)) {
            if (Number(this.allEvents.get(type)?.length) >= 1) {
                for (let i = 0; i < Number(this.allEvents.get(type)?.length); i++) {
                    if ((this.allEvents.get(type) as IEventObject[])[i].handler === handler) {
                        (this.allEvents.get(type) as IEventObject[]).splice(i, 1);
                    }
                }
            }
            if (this.allEvents.get(type)?.length == 0) {
                this.allEvents.delete(type);
            }
        }
    }
    public static dispatch(type: string, data?: string): void {
        if (this.allEvents.has(type)) {
            for (let i = 0; i < (this.allEvents.get(type) as IEventObject[]).length; i++) {
                const event: Event = new Event(type, data);
                const eventObject: IEventObject = (this.allEvents.get(type) as IEventObject[])[i];
                eventObject.handler.call(eventObject.scope, event);
                if (eventObject.once) {
                    (this.allEvents.get(type) as IEventObject[]).splice(i, 1);
                }
            }
            if (this.allEvents.get(type)?.length == 0) {
                this.allEvents.delete(type);
            }
        }
    }
}