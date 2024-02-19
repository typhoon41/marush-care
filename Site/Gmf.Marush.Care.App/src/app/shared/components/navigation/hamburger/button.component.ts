import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'marush-hamburger-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss'
})
export class HamburgerButtonComponent {
    collapsed = false;

    readonly toggle = () => {
        this.collapsed = !this.collapsed;
    };
}
