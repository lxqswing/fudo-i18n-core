type Listener = (...args: any[]) => void;
export declare class EventEmitter {
    private events;
    on(event: string, callback: Listener): void;
    off(event: string, callback: Listener): void;
    once(event: string, callback: Listener): void;
    emit(event: string, ...args: any[]): void;
}
export {};
