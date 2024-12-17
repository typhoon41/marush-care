import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';

@Component({
    selector: 'marush-dialog',
    imports: [CommonModule],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss'
})
export class DialogComponent {
    @HostBinding('class') classAttribute: string = 'marush-dialog stretch';
    @ViewChild('dialog') dialog: ElementRef | undefined;
    @Input() title: string | undefined;
    @Input() bodyClass: string | undefined;
    @Input() footerClass: string | undefined;

    readonly open = () => {
        this.dialog?.nativeElement.showModal();
    };

    readonly close = (event?: OptionalKeyboardEvent) => {
        if (isAction(event)) {
            this.dialog?.nativeElement.close();
        }
    };

    readonly onDialogClick = (event: Event) => {
        event.stopImmediatePropagation();
    };
}
