import { CommonModule } from '@angular/common';
import { Component, computed, ViewChild } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { environment } from '@env';
import { SizeService } from '@shared/services/size.service';
import { BaseRoutingComponent } from '../base-routing.component';
import { HamburgerButtonComponent } from '../hamburger/button.component';
import { LanguageSelectorComponent } from '../language/selector.component';
import { MobileMenuComponent } from '../mobile/menu.component';
import { MenuItemsComponent } from './items/menu-items.component';

@Component({
  selector: 'marush-menu',
  imports: [CommonModule, RouterModule, LanguageSelectorComponent,
    HamburgerButtonComponent, MobileMenuComponent, MenuItemsComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent extends BaseRoutingComponent {
  environment = environment;
  showMobileMenu = false;
  logoHovered = false;
  isMobile = computed(() => this.sizeService.lastKnownSize()?.supportsMenu);

  @ViewChild(RouterLinkActive) rla: RouterLinkActive | undefined;

  constructor(readonly sizeService: SizeService) {
    super();
  }

  readonly logoPath = () => this.rla?.isActive || this.logoHovered ?
    '/assets/images/logo-active.png' : '/assets/images/logo.png';

  readonly hideMobileMenu = () => {
    this.showMobileMenu = false;
  };
}
