import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';
import marushDetails from '@shared/models/marush-details';
import { RouteTranslator } from '../../pipes/routing-translator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss'
})
export class Footer {
  protected readonly marushDetails = marushDetails;

  constructor(private readonly router: Router, private readonly routeTranslator: RouteTranslator) { }

  protected readonly redirectToContact = async(event?: OptionalKeyboardEvent) => {
    if (isAction(event)) {
      await this.router.navigate([this.routeTranslator.transform('contact')]);
    }
  };
}
