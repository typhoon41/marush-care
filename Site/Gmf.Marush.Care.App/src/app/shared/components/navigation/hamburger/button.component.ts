import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'marush-hamburger-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class HamburgerButtonComponent implements OnInit {
    @Output() collapsedEvent = new EventEmitter<boolean>();

    collapsed = false;

    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    ngOnInit(): void {
        this.emitEvent();
    }

    readonly toggle = () => {
        this.collapsed = !this.collapsed;
        this.emitEvent();
    };

    private readonly emitEvent = () => this.collapsedEvent.emit(this.collapsed);
}
