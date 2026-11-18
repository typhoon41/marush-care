import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BasePage } from '@shared/components/page/base/base-page';
import { SimplePage } from '@shared/components/page/simple-page';
import { RequestSentPageMetadata } from './page-metadata';
import { IRepresentUserRequest } from './user';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-client-notified-page',
    imports: [RouterModule, SimplePage],
    templateUrl: './request-sent-page.html',
    styleUrl: './request-sent-page.scss'
})
export class RequestSentPage extends BasePage {
    protected readonly text =
        $localize`:@@appointment.request.sent:Vaš zahtev za zakazivanje termina je poslat. Očekujte uskoro potvrdu putem email-a.`;

    constructor() {
        super(new RequestSentPageMetadata(inject(Router).currentNavigation()?.extras.state as IRepresentUserRequest));
    }
}
