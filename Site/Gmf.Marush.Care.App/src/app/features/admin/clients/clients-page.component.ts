import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-login-page',
    imports: [],
    templateUrl: './clients-page.component.html',
    styleUrl: './clients-page.component.scss'
})
export class ClientsPageComponent {
    constructor(private readonly title: Title) {
        this.title.setTitle('Marush: Space of Care - klijenti');
    }
}
