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

    private readonly buttonShrinked = $localize`:@@content.menu.open:Otvori meni`;
    private readonly buttonCollapsed = $localize`:@@content.menu.close:Zatvori meni`;
    buttonDescription: string = '';

    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    ngOnInit(): void {
        this.emitEvent();
        this.setButtonDescription();
    }

    readonly toggle = (event?: OptionalKeyboardEvent) => {
        if (isAction(event)) {
            event?.preventDefault();
            this.collapsed = !this.collapsed;
            this.setButtonDescription();
            this.emitEvent();
        }
    };

    private readonly emitEvent = () => this.collapsedChange.emit(this.collapsed);
    private readonly setButtonDescription = () => {
        this.buttonDescription = this.collapsed ? this.buttonCollapsed : this.buttonShrinked;
    };
}
