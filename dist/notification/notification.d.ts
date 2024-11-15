interface NotificationSettings {
    content: string;
    triggerElement: HTMLElement | string;
    hostElement: HTMLElement;
    duration: number;
    onDismiss?: () => void;
    customClass?: string;
    dismissible: boolean;
}
declare class Notification {
    settings: NotificationSettings;
    element: HTMLDivElement | null;
    eventHandlers: Record<string, (...args: any) => void>;
    dismissButton?: HTMLElement;
    dismissalTimer?: number | null;
    constructor(settings: NotificationSettings);
    insert(): void;
    bindEvents(): void;
    initiateTimer(duration?: number): void;
    cancelTimer(): void;
    dismiss(): void;
}
declare function notification(options: Partial<NotificationSettings>): Notification;
export default notification;
export declare const isInSameOriginIframe: () => boolean;
