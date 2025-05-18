import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, viewChild } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { environment } from '@env';
import marushDetails from '@shared/models/marush-details.model';
import { AuthenticationService } from '@shared/services/authentication-service';
import { SizeService } from '@shared/services/size.service';
import { RouteTranslatorPipe } from '../../../pipes/routing-translator-pipe';
import { HamburgerButtonComponent } from '../hamburger/button.component';
import { LanguageSelectorComponent } from '../language/selector.component';
import { MobileMenuComponent } from '../mobile/menu.component';
import { MenuItemsComponent } from './items/menu-items.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-menu',
  imports: [CommonModule, RouterModule, LanguageSelectorComponent,
    HamburgerButtonComponent, MobileMenuComponent, MenuItemsComponent, RouteTranslatorPipe],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  environment = environment;
  marushDetails = marushDetails;
  showMobileMenu = false;
  logoHovered = false;
  adminLogoHovered = false;
  readonly isMobile = computed(() => this.sizeService.lastKnownSize()?.supportsMenu);
  readonly logo = viewChild<RouterLinkActive>('logo');
  readonly adminLogo = viewChild<RouterLinkActive>('adminLogo');

  constructor(readonly sizeService: SizeService,
    readonly authenticationService: AuthenticationService
  ) { }

  readonly adminLogoPath = () => this.adminLogo()?.isActive || this.adminLogoHovered ?
    '/assets/images/menu/admin-active.svg' : '/assets/images/menu/admin.svg';

  readonly logoPath = () => this.logo()?.isActive || this.logoHovered ?
    '/assets/images/logo-active.png' : '/assets/images/logo.png';

  readonly hideMobileMenu = () => {
    this.showMobileMenu = false;
  };
}
