import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { environment } from '@env';
import { SizeService } from 'src/app/shared/services/size.service';
import { BaseRoutingComponent } from '../base-routing.component';
import { HamburgerButtonComponent } from '../hamburger/button.component';
import { LanguageSelectorComponent } from '../language/selector.component';
import { MobileMenuComponent } from '../mobile/menu.component';
import { MenuItemsComponent } from './items/menu-items.component';

@Component({
  selector: 'marush-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSelectorComponent,
    HamburgerButtonComponent, MobileMenuComponent, MenuItemsComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent extends BaseRoutingComponent {
  environment = environment;
  showMobileMenu = false;
  logoHovered = false;

  @ViewChild(RouterLinkActive) rla: RouterLinkActive | undefined;

  constructor(readonly sizeService: SizeService) {
    super();
   }

  get isMobile() {
    return this.sizeService.lastKnownSize?.supportsMenu;
  }

  readonly logoPath = () => this.rla?.isActive || this.logoHovered ?
    '/assets/images/logo-active.png' : '/assets/images/logo.png';

  readonly hideMobileMenu = () => {
    this.showMobileMenu = false;
  };
}
