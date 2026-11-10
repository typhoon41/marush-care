/** Collapses a dropdown when a pointer goes down anywhere outside its host element. */
export class OutsidePointerWatch {
    private listener?: (event: Event) => void;

    constructor(private readonly host: HTMLElement, private readonly onOutside: () => void) { }

    readonly start = () => {
        if (this.listener) {
            return;
        }

        this.listener = (event: Event) => {
            if (!this.host.contains(event.target as Node)) {
                this.onOutside();
            }
        };
        document.addEventListener('pointerdown', this.listener, true);
    };

    readonly stop = () => {
        if (!this.listener) {
            return;
        }

        document.removeEventListener('pointerdown', this.listener, true);
        this.listener = undefined;
    };
}
