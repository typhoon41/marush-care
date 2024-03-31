import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
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
  marushDetails = marushDetails;

  readonly hideMenu = () => this.hideMobileMenu.emit();
}
