import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env';
import { AuthenticationService } from '@shared/services/authentication-service';
import { LanguageSelectorComponent } from '../language/selector.component';
import { MenuItemsComponent } from '../menu/items/menu-items.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-mobile-menu',
  imports: [CommonModule, RouterModule, LanguageSelectorComponent, MenuItemsComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MobileMenuComponent {
  readonly collapsed = input<boolean>(true);
  readonly hideMobileMenu = output();
  environment = environment;

  constructor(readonly authenticationService: AuthenticationService) { }

  readonly hideMenu = () => this.hideMobileMenu.emit();
}
