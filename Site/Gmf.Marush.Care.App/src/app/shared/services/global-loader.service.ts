import { Injectable } from '@angular/core';
import { EventType } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GlobalLoaderService {
    isLoading = new BehaviorSubject<boolean>(true);

    intercept = (eventType: EventType) => {
        switch (eventType) {
            case EventType.NavigationStart: {
                this.isLoading.next(true);
               break;
            }
            case EventType.NavigationEnd:
            case EventType.NavigationCancel:
            case EventType.NavigationError:
            {
                this.isLoading.next(false);
               break;
            }
            default: {
               break;
            }
         }
    };
}
