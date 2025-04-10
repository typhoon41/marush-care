import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, input, viewChild } from '@angular/core';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-dialog',
    imports: [CommonModule],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss'
})
export class DialogComponent {
    @HostBinding('class') classAttribute: string = 'marush-dialog stretch';
    readonly dialog = viewChild<ElementRef>('dialog');
    readonly title = input<string>();
    readonly bodyClass = input<string>();
    readonly footerClass = input<string>();

    readonly open = () => {
        this.dialog()?.nativeElement.showModal();
    };

    readonly close = (event?: OptionalKeyboardEvent) => {
        if (isAction(event)) {
            this.dialog()?.nativeElement.close();
        }
    };

    readonly onDialogClick = (event: Event) => {
        event.stopImmediatePropagation();
    };
}
