import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChild } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { environment } from '@env';
import marushDetails from '@shared/models/marush-details';
import { RouteTranslator } from '@shared/pipes/routing-translator';
import { Authentication } from '@shared/services/authentication';
import { ScreenSize } from '@shared/services/screen-size';
import { HamburgerButton } from '../hamburger/button';
import { LanguageSelector } from '../language/selector';
import { MobileMenu } from '../mobile/menu';
import { MenuItems } from './items/menu-items';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-menu',
  imports: [CommonModule, RouterModule, LanguageSelector,
    HamburgerButton, MobileMenu, MenuItems, RouteTranslator],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu {
  protected readonly environment = environment;
  protected readonly marushDetails = marushDetails;
  protected readonly screenSize = inject(ScreenSize);
  protected readonly authentication = inject(Authentication);
  protected readonly showMobileMenu = signal(false);
  protected readonly logoHovered = signal(false);
  protected readonly adminLogoHovered = signal(false);
  protected readonly isMobile = computed(() => this.screenSize.lastKnownSize()?.supportsMenu);
  private readonly logo = viewChild<RouterLinkActive>('logo');
  private readonly adminLogo = viewChild<RouterLinkActive>('adminLogo');

  protected readonly adminLogoPath = () => this.adminLogo()?.isActive || this.adminLogoHovered() ?
    '/assets/images/menu/admin-active.svg' : '/assets/images/menu/admin.svg';

  protected readonly logoPath = () => this.logo()?.isActive || this.logoHovered() ?
    '/assets/images/logo-active.png' : '/assets/images/logo.png';

  protected readonly hideMobileMenu = () => {
    this.showMobileMenu.set(false);
  };
}
