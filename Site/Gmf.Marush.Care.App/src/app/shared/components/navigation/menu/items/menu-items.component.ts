import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { isAction, OptionalKeyboardEvent } from '@shared/functions/keyboard-event';
import marushDetails from '@shared/models/marush-details.model';
import { AuthenticationService } from '@shared/services/authentication-service';
import { RouteTranslatorPipe } from '../../../../pipes/routing-translator-pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-menu-items',
  imports: [CommonModule, RouterModule, RouteTranslatorPipe],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss',
  host: {
    '[class]': 'classAttribute()'
  }
})
export class MenuItemsComponent {
  constructor(readonly authenticationService: AuthenticationService,
    private readonly router: Router) {
  }

  readonly classAttribute = computed(() =>
    this.authenticationService.isCurrentRouteProtected() ? 'protected-menu-items aligned-centrally stretch-between' : '');

  readonly hideMobileMenu = output();
  readonly visible = input<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  readonly tabIndex = computed(() => this.visible() ? 0 : -1);

  marushDetails = marushDetails;

  readonly hideMenu = () => this.hideMobileMenu.emit();

  readonly logOut = async(event?: OptionalKeyboardEvent) => {
    if (isAction(event)) {
      this.authenticationService.logout();
      await this.router.navigate(['']);
    }
  };
}
