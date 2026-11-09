import { Signal, signal } from '@angular/core';
import { Dialog } from './dialog';

/** Runs a single dialog action, exposing its progress and failure to the template and closing the dialog on success. */
export class DialogOperation {
    readonly isLoading = signal(false);
    readonly failed = signal(false);

    constructor(private readonly dialog: Signal<Dialog>) { }

    readonly reset = () => this.failed.set(false);

    readonly run = async(action: () => Promise<void>): Promise<boolean> => {
        this.failed.set(false);
        this.isLoading.set(true);
        try {
            await action();
            this.dialog().dismiss();
            return true;
        } catch {
            this.failed.set(true);
            return false;
        } finally {
            this.isLoading.set(false);
        }
    };
}
