import { HttpErrorResponse } from '@angular/common/http';
import { Signal, computed, signal } from '@angular/core';
import { Dialog } from './dialog';

/** Runs a single dialog action, exposing its progress and failure to the template and closing the dialog on success. */
export class DialogOperation {
    private readonly failure = signal<{ status: number | null } | null>(null);

    readonly isLoading = signal(false);
    readonly failed = computed(() => this.failure() !== null);

    /**
     * The HTTP status the failed action was rejected with. Known only for the statuses its request
     * listed in `callerHandledStatuses`: the error interceptor hands every other failure on without one.
     */
    readonly failureStatus = computed(() => this.failure()?.status ?? null);

    constructor(private readonly dialog: Signal<Dialog>) { }

    readonly reset = () => this.failure.set(null);

    readonly run = async(action: () => Promise<void>): Promise<boolean> => {
        this.reset();
        this.isLoading.set(true);
        try {
            await action();
            this.dialog().dismiss();
            return true;
        } catch(rejection) {
            this.failure.set({ status: rejection instanceof HttpErrorResponse ? rejection.status : null });
            return false;
        } finally {
            this.isLoading.set(false);
        }
    };
}
