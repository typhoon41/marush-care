import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';

@Component({
    selector: 'marush-hamburger-button',
    imports: [CommonModule],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class HamburgerButtonComponent implements OnInit {
    @Input() collapsed: boolean = false;
    @Output() collapsedChange = new EventEmitter<boolean>();


    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    ngOnInit(): void {
        this.emitEvent();
    }

    readonly toggle = (event?: OptionalKeyboardEvent) => {
        if (isAction(event)) {
            event?.preventDefault();
            this.collapsed = !this.collapsed;
            this.emitEvent();
        }
    };

    private readonly emitEvent = () => this.collapsedChange.emit(this.collapsed);
}
