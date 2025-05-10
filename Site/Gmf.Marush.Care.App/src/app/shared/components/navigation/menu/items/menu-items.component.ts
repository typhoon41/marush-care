import { CommonModule, Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import marushDetails from '@shared/models/marush-details.model';
import { RoutingDefinition } from 'src/app/app.routes';
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
  constructor(private readonly location: Location) {
    this.location.onUrlChange(() => {
      this.isCurrentRouteProtected.set(this.checkProtectedLocation());
    });
   }

  readonly checkProtectedLocation = () => new RoutingDefinition().isCurrentProtected(this.location);
  readonly isCurrentRouteProtected = signal(this.checkProtectedLocation());
  readonly classAttribute = computed(() => this.isCurrentRouteProtected() ? 'protected-menu-items aligned-centrally stretch-between' : '');

  readonly hideMobileMenu = output();
  readonly visible = input<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  readonly tabIndex = computed(() => this.visible() ? 0 : -1);

  marushDetails = marushDetails;

  readonly hideMenu = () => this.hideMobileMenu.emit();
}
