import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env';
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

  readonly priceListUrl = () => {
    const fileName = $localize`:@@pricelist:cenovnik`;
    return `${environment.staticContentUrl}${fileName}.pdf`;
  };

  readonly hideMenu = () => this.hideMobileMenu.emit();
}
