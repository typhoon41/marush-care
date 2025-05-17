import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-login-page',
    imports: [],
    templateUrl: './clients-page.component.html',
    styleUrl: './clients-page.component.scss'
})
export class ClientsPageComponent {
}
