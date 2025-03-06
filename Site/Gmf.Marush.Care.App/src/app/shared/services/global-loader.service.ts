import { Injectable, signal } from '@angular/core';
import { EventType } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class GlobalLoaderService {
    readonly isLoading = signal(true);

    readonly startLoading = () => this.isLoading.update(() => true);
    readonly stopLoading = () => this.isLoading.update(() => false);

    readonly intercept = (eventType: EventType) => {
        switch (eventType) {
            case EventType.NavigationStart: {
                this.startLoading();
               break;
            }
            case EventType.NavigationEnd:
            case EventType.NavigationCancel:
            case EventType.NavigationError:
            {
                this.stopLoading();
               break;
            }
            default: {
               break;
            }
         }
    };
}
