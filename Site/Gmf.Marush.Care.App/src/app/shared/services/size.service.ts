import { Injectable } from '@angular/core';
import { Observable, Subject, fromEvent } from 'rxjs';
import { distinctUntilKeyChanged } from 'rxjs/operators';
import { ScreenSizeFactory } from '../models/screen-sizes/factory';
import { Size } from '../models/screen-sizes/size';

@Injectable({
    providedIn: 'root'
})
export class SizeService {
    lastKnownSize: Size | undefined;
    onResize$: Observable<Size>;

    private readonly holderPseudoSelector = '::before';
    private readonly holderPropertyName: string = 'content';

    private resizeSubject = new Subject<Size>();

    constructor() {
        this.onResize$ = this.resizeSubject.asObservable()
            .pipe(distinctUntilKeyChanged('name'));
    }

    readonly startTrackingResizeOf = (document: Document) => {
        fromEvent(window, 'resize')
            .subscribe(() => this.onResize(document));
        this.onResize(document);
    };

    private readonly onResize = (document: Document) => {
        const elementFound = document.body;
        const placeholderStyle = window.getComputedStyle(elementFound, this.holderPseudoSelector);
        const value = placeholderStyle.getPropertyValue(this.holderPropertyName);
        const size = value.replace(/"/gu, '');

        this.lastKnownSize = ScreenSizeFactory.createFrom(size);
        this.resizeSubject.next(this.lastKnownSize);
    };
}
