import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env';
import { LanguageSelectorComponent } from '../language/selector.component';
import { MenuItemsComponent } from '../menu/items/menu-items.component';

@Component({
  selector: 'marush-mobile-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSelectorComponent, MenuItemsComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MobileMenuComponent {
  environment = environment;
}
