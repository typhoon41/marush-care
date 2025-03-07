import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';
import marushDetails from '@shared/models/marush-details.model';
import { RouteTranslatorPipe } from '../../pipes/routing-translator-pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-footer',
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  marushDetails = marushDetails;

  constructor(private readonly router: Router, private readonly routeTranslatorPipe: RouteTranslatorPipe) { }

  readonly redirectToContact = async(event?: OptionalKeyboardEvent) => {
    if (isAction(event)) {
      await this.router.navigate([this.routeTranslatorPipe.transform('contact')]);
    }
  };
}
