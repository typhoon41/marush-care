import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';
import marushDetails from '@shared/models/marush-details.model';
import { BaseRoutingComponent } from '../navigation/base-routing.component';

@Component({
  selector: 'marush-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent extends BaseRoutingComponent {
  marushDetails = marushDetails;

  constructor(private readonly router: Router) {
    super();
  }

  readonly redirectToContact = (event?: OptionalKeyboardEvent) => {
    if (isAction(event)) {
      this.router.navigate([this.translateRoute('contact')]);
    }
  };
}
