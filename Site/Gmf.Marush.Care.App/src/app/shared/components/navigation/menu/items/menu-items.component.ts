import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import marushDetails from '@shared/models/marush-details.model';
import { BaseRoutingComponent } from '../../base-routing.component';

@Component({
  selector: 'marush-menu-items',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss'
})
export class MenuItemsComponent extends BaseRoutingComponent {
  @Output() hideMobileMenu = new EventEmitter<boolean>();
  @Input() visible = true;
  marushDetails = marushDetails;

  get tabIndex() {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return this.visible ? 0 : -1;
  }

  readonly hideMenu = () => this.hideMobileMenu.emit();
}
