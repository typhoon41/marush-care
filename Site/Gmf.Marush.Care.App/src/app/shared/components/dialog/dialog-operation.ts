import { signal } from '@angular/core';

/** Runs a single dialog action, exposing its progress and failure to the template. */
export class DialogOperation {
    readonly isLoading = signal(false);
    readonly failed = signal(false);

    readonly reset = () => this.failed.set(false);

    readonly run = async(action: () => Promise<void>): Promise<boolean> => {
        this.failed.set(false);
        this.isLoading.set(true);
        try {
            await action();
            return true;
        } catch {
            this.failed.set(true);
            return false;
        } finally {
            this.isLoading.set(false);
        }
    };
}
