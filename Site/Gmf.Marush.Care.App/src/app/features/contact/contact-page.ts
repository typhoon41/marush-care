
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BasePage } from '@shared/components/page/base/base-page';
import marushDetails from '@shared/models/marush-details';
import { RouteTranslator } from '@shared/pipes/routing-translator';
import { Stapler } from '@shared/services/metadata/stapler';
import { ContactPageMetadata } from './page-metadata';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-contact-page',
  imports: [RouterModule, RouteTranslator],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.scss',
  host: { class: 'contact-container row' }
})
export class ContactPage extends BasePage {
  protected readonly marushDetails = marushDetails;

  constructor(protected override readonly stapler: Stapler) {
    super(stapler, new ContactPageMetadata());
  }
}
