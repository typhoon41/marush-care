import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BasePageComponent } from '@shared/components/page/base/base-page.component';
import { SimplePageComponent } from '@shared/components/page/simple-page.component';
import { PageMetadataService } from '@shared/services/metadata/page-metadata.service';
import { RequestSentPageMetadata } from './page-metadata.model';
import { IRepresentUserRequest } from './request-user.model';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-client-notified-page',
    imports: [RouterModule, SimplePageComponent],
    templateUrl: './request-sent-page.component.html',
    styleUrl: './request-sent-page.component.scss'
})
export class RequestSentPageComponent extends BasePageComponent {
    readonly text = $localize`:@@appointment.request.sent:Vaš zahtev za zakazivanje termina je poslat. Očekujte uskoro potvrdu putem email-a.`;

    constructor(protected override readonly metadataService: PageMetadataService, protected readonly router: Router) {
        super(metadataService, new RequestSentPageMetadata(router.currentNavigation()?.extras.state as IRepresentUserRequest));
    }
}
