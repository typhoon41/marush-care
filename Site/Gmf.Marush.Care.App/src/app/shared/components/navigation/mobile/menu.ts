import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env';
import { Authentication } from '@shared/services/authentication';
import { LanguageSelector } from '../language/selector';
import { MenuItems } from '../menu/items/menu-items';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-mobile-menu',
  imports: [CommonModule, RouterModule, LanguageSelector, MenuItems],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class MobileMenu {
  readonly collapsed = input<boolean>(true);
  readonly hideMobileMenu = output();
  protected readonly environment = environment;

  constructor(protected readonly authentication: Authentication) { }

  protected readonly hideMenu = () => this.hideMobileMenu.emit();
}
