import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { environment } from '@env';
import { LanguageSelectorComponent } from '../language/selector.component';

@Component({
  selector: 'marush-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSelectorComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  environment = environment;
  @ViewChild(RouterLinkActive) rla: RouterLinkActive | undefined;

    logoHovered = false;
    readonly logoPath = () => this.rla?.isActive || this.logoHovered ?
      'assets/images/logo-active.png' : 'assets/images/logo.png';
}
