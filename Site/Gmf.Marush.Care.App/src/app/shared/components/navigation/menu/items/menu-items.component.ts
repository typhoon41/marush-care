import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import marushDetails from '@shared/models/marush-details.model';
import { RouteTranslatorPipe } from '../../../../pipes/routing-translator-pipe';

@Component({
  selector: 'marush-menu-items',
  imports: [CommonModule, RouterModule, RouteTranslatorPipe],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss'
})
export class MenuItemsComponent {
  @Output() readonly hideMobileMenu = new EventEmitter<boolean>();
  readonly visible = input<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  readonly tabIndex = computed(() => this.visible() ? 0 : -1);

  marushDetails = marushDetails;

  readonly hideMenu = () => this.hideMobileMenu.emit();
}
