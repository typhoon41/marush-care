/* eslint-disable @stylistic/max-len */
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'marush-error-page',
    standalone: true,
    imports: [],
    templateUrl: './error.component.html',
    styleUrl: './error.component.scss'
})
export class ErrorPageComponent {
    systemError: boolean;

    constructor(private readonly title: Title, private readonly route: ActivatedRoute) {
        const errorType = this.route.snapshot.paramMap.get('errorType');
        this.systemError = errorType === $localize`:@@routes.error.system:sistemska`;
        const titleMessage = this.systemError ?
            $localize`:@@routes.error.system.title:Marush: Space of Care - sistemska greška` :
            $localize`:@@routes.error.not-found.title:Marush: Space of Care - stranica nije pronađena`;

        this.title.setTitle(titleMessage);
    }
}
