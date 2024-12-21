import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { RouterLinkActive, RouterModule } from '@angular/router';
import { environment } from '@env';
import { SizeService } from '@shared/services/size.service';
import { Subscription } from 'rxjs';
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
export class MenuComponent extends BaseRoutingComponent implements AfterViewInit, OnDestroy {
  environment = environment;
  showMobileMenu = false;
  logoHovered = false;
  isMobile = false;
  private subscription: Subscription | undefined;

  @ViewChild(RouterLinkActive) rla: RouterLinkActive | undefined;

  constructor(readonly sizeService: SizeService) {
    super();
  }

  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  ngAfterViewInit(): void {
    this.subscription = this.sizeService.lastKnownSize.subscribe(size => {
      this.isMobile = size.supportsMenu;
    });
  }

  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  readonly logoPath = () => this.rla?.isActive || this.logoHovered ?
    '/assets/images/logo-active.png' : '/assets/images/logo.png';

  readonly hideMobileMenu = () => {
    this.showMobileMenu = false;
  };
}
