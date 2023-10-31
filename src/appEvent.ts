export interface IAppEvent<T> {
    addHandler(handler: { (data: T): void }): void;
    removeHandler(handler: { (data: T): void }): void;
}

export default class AppEvent<T> implements IAppEvent<T>
{
    private _handlers: { (data: T): void }[] = [];

    public addHandler(handler: { (data: T): void }): void {
        this._handlers.push(handler);
    }
    public removeHandler(handler: { (data: T): void }): void {
        this._handlers.splice(this._handlers.indexOf(handler));
    }
    public raiseEvent(data: T) {
        this._handlers.slice(0).forEach(x => x(data));
    }
}