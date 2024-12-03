import { Injectable } from '@angular/core';
import { EventType } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GlobalLoaderService {
    isLoading = new BehaviorSubject<boolean>(true);

    readonly startLoading = () => this.isLoading.next(true);
    readonly stopLoading = () => this.isLoading.next(false);

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
