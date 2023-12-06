import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  @ViewChild(RouterLinkActive) rla: RouterLinkActive | undefined;

    logoHovered = false;
    readonly logoPath = () => this.rla?.isActive || this.logoHovered ?
      'assets/images/logo-active.png' : 'assets/images/logo.png';
}
