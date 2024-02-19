import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { environment } from '@env';
import { BaseRoutingComponent } from '../base-routing.component';
import { HamburgerButtonComponent } from '../hamburger/button.component';
import { LanguageSelectorComponent } from '../language/selector.component';

@Component({
  selector: 'marush-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSelectorComponent, HamburgerButtonComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent extends BaseRoutingComponent {
  environment = environment;
  @ViewChild(RouterLinkActive) rla: RouterLinkActive | undefined;

  logoHovered = false;
  readonly logoPath = () => this.rla?.isActive || this.logoHovered ?
    '/assets/images/logo-active.png' : '/assets/images/logo.png';
}
