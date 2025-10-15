import { Injectable, OnDestroy, signal } from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { ScreenSizeFactory } from '../models/screen-sizes/factory';
import { Size } from '../models/screen-sizes/size';

@Injectable({
    providedIn: 'root'
})
export class ScreenSize implements OnDestroy {
    readonly lastKnownSize = signal<Size | undefined>(undefined);

    private readonly holderPseudoSelector = '::before';
    private readonly holderPropertyName: string = 'content';
    private subscription: Subscription | undefined;

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    readonly startTrackingResizeOf = (document: Document) => {
        this.subscription = fromEvent(window, 'resize')
            .subscribe(() => this.onResize(document));
        this.onResize(document);
    };

    private readonly onResize = (document: Document) => {
        const elementFound = document.body;
        const placeholderStyle = window.getComputedStyle(elementFound, this.holderPseudoSelector);
        const value = placeholderStyle.getPropertyValue(this.holderPropertyName);
        const size = value.replace(/"/gu, '');

        this.lastKnownSize.update(_ => ScreenSizeFactory.createFrom(size));
    };
}
