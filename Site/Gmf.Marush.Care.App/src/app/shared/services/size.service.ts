import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription, fromEvent } from 'rxjs';
import { distinctUntilKeyChanged } from 'rxjs/operators';
import { ScreenSizeFactory } from '../models/screen-sizes/factory';
import { Size } from '../models/screen-sizes/size';

@Injectable({
    providedIn: 'root'
})
export class SizeService implements OnDestroy {
    lastKnownSize = new Subject<Size>();
    onResize$: Observable<Size>;

    private readonly holderPseudoSelector = '::before';
    private readonly holderPropertyName: string = 'content';
    private subscription: Subscription | undefined;

    constructor() {
        this.onResize$ = this.lastKnownSize.asObservable()
            .pipe(distinctUntilKeyChanged('name'));
    }

    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
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

        this.lastKnownSize.next(ScreenSizeFactory.createFrom(size));
    };
}
