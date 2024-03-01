import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { environment } from '@env';
import { BaseRoutingComponent } from '../../base-routing.component';

@Component({
  selector: 'marush-menu-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss'
})
export class MenuItemsComponent extends BaseRoutingComponent {
  readonly priceListUrl = () => {
    const fileName = $localize`:@@pricelist:cenovnik`;
    return `${environment.staticContentUrl}${fileName}.pdf`;
  };
}
