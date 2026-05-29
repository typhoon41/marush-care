import { CommonModule } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-dialog',
    imports: [CommonModule],
    templateUrl: './dialog.html',
    styleUrl: './dialog.scss',
    host: { class: 'marush-dialog stretch' }
})
export class Dialog {
    readonly dialog = viewChild<ElementRef>('dialog');
    readonly title = input<string>();
    readonly bodyClass = input<string>();
    readonly footerClass = input<string>();

    constructor() {
        afterNextRender(() => {
            this.dialog()?.nativeElement.addEventListener('close', () => {
                document.body.classList.remove('dialog-open');
            });
        });
    }

    readonly open = () => {
        this.dialog()?.nativeElement.showModal();
        document.body.classList.add('dialog-open');
    };

    readonly dismiss = () => {
        this.dialog()?.nativeElement.close();
    };

    protected readonly close = (event?: OptionalKeyboardEvent) => {
        if (isAction(event)) {
            this.dismiss();
        }
    };

    protected readonly onDialogClick = (event: Event) => {
        event.stopImmediatePropagation();
    };
}
