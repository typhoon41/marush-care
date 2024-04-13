import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'marush-hamburger-button',
    standalone: true,
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

    readonly toggle = () => {
        this.collapsed = !this.collapsed;
        this.emitEvent();
    };

    private readonly emitEvent = () => this.collapsedChange.emit(this.collapsed);
}
