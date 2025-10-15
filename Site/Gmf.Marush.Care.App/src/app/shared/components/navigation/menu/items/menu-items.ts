import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { isAction, OptionalKeyboardEvent } from '@shared/functions/keyboard-event';
import marushDetails from '@shared/models/marush-details';
import { Authentication } from '@shared/services/authentication';
import { RouteTranslator } from '../../../../pipes/routing-translator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-menu-items',
  imports: [CommonModule, RouterModule, RouteTranslator],
  templateUrl: './menu-items.html',
  styleUrl: './menu-items.scss',
  host: {
    '[class]': 'classAttribute()'
  }
})
export class MenuItems {
  constructor(readonly authenticationService: Authentication, private readonly router: Router) { }

  readonly classAttribute = computed(() =>
    this.authenticationService.isCurrentRouteProtected() ? 'protected-menu-items aligned-centrally stretch-between' : '');

  readonly hideMobileMenu = output();
  readonly visible = input<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  protected readonly tabIndex = computed(() => this.visible() ? 0 : -1);

  protected readonly marushDetails = marushDetails;

  protected readonly hideMenu = () => this.hideMobileMenu.emit();

  protected readonly logOut = async(event?: OptionalKeyboardEvent) => {
    if (isAction(event)) {
      this.authenticationService.logout();
      await this.router.navigate(['']);
    }
  };
}
