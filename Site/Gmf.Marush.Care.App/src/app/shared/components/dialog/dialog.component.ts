import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'marush-dialog',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss'
})
export class DialogComponent {
    @HostBinding('class') classAttribute: string = 'marush-dialog stretch';
    @ViewChild('dialog') dialog: ElementRef | undefined;
    @Input() title: string = '';

    readonly open = () => {
        this.dialog?.nativeElement.showModal();
    };

    readonly close = (event: KeyboardEvent | null = null) => {
        if (!event || event.key === 'Enter' || event.key === ' ') {
            this.dialog?.nativeElement.close();
        }
    };

    readonly onDialogClick = (event: Event) => {
        event.stopImmediatePropagation();
    };
}
