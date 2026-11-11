import { HttpErrorResponse } from '@angular/common/http';
import { Signal, signal } from '@angular/core';
import { Dialog } from './dialog';

/** Runs a single dialog action, exposing its progress and failure to the template and closing the dialog on success. */
export class DialogOperation {
    readonly isLoading = signal(false);
    readonly failed = signal(false);

    /** The HTTP status the failed action was rejected with, when the server answered at all. */
    readonly failureStatus = signal<number | null>(null);

    constructor(private readonly dialog: Signal<Dialog>) { }

    readonly reset = () => {
        this.failed.set(false);
        this.failureStatus.set(null);
    };

    readonly run = async(action: () => Promise<void>): Promise<boolean> => {
        this.reset();
        this.isLoading.set(true);
        try {
            await action();
            this.dialog().dismiss();
            return true;
        } catch(rejection) {
            this.failed.set(true);
            this.failureStatus.set(rejection instanceof HttpErrorResponse ? rejection.status : null);
            return false;
        } finally {
            this.isLoading.set(false);
        }
    };
}
