import { Component } from '@angular/core';
import { SimplePageComponent } from '@shared/components/page/simple-page.component';

@Component({
    selector: 'marush-client-notified-page',
    standalone: true,
    imports: [SimplePageComponent],
    templateUrl: './request-sent-page.component.html',
    styleUrl: './request-sent-page.component.scss'
})
export class RequestSentPageComponent {
    // eslint-disable-next-line @stylistic/max-len
    readonly text = $localize`:@@appointment.request.sent:Vaš zahtev za zakazivanje termina je poslat. Očekujte uskoro potvrdu putem email-a.`;
}
