import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';
import marushDetails from '@shared/models/marush-details.model';
import { RouteTranslatorPipe } from '../../pipes/routing-translator-pipe';

@Component({
  selector: 'marush-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  marushDetails = marushDetails;

  constructor(private readonly router: Router, private readonly routeTranslatorPipe: RouteTranslatorPipe) {}

  readonly redirectToContact = (event?: OptionalKeyboardEvent) => {
    if (isAction(event)) {
      this.router.navigate([this.routeTranslatorPipe.transform('contact')]);
    }
  };
}
