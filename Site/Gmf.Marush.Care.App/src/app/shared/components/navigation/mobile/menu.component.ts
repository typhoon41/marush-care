import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env';
import { BaseRoutingComponent } from '../base-routing.component';
import { LanguageSelectorComponent } from '../language/selector.component';

@Component({
  selector: 'marush-mobile-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSelectorComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MobileMenuComponent extends BaseRoutingComponent {
  environment = environment;
}
