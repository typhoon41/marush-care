import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import marushDetails from '@shared/models/marush-details.model';
import { RouteTranslatorPipe } from '../../../../pipes/routing-translator-pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-menu-items',
  imports: [CommonModule, RouterModule, RouteTranslatorPipe],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss'
})
export class MenuItemsComponent {
  readonly hideMobileMenu = output();
  readonly visible = input<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  readonly tabIndex = computed(() => this.visible() ? 0 : -1);

  marushDetails = marushDetails;

  readonly hideMenu = () => this.hideMobileMenu.emit();
}
