import { CommonModule } from '@angular/common';
import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import marushDetails from '@shared/models/marush-details.model';
import { BaseRoutingComponent } from '../../base-routing.component';

@Component({
  selector: 'marush-menu-items',
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss'
})
export class MenuItemsComponent extends BaseRoutingComponent {
  @Output() hideMobileMenu = new EventEmitter<boolean>();
  visible = input<boolean>(true);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  tabIndex = computed(() => this.visible() ? 0 : -1);

  marushDetails = marushDetails;

  readonly hideMenu = () => this.hideMobileMenu.emit();
}
