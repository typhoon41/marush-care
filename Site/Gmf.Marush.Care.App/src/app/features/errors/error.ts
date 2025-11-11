
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'marush-error-page',
    imports: [],
    templateUrl: './error.html',
    styleUrl: './error.scss',
    host: { class: 'center-content vertical-stack' }
})
export class ErrorPage {
    protected readonly errors = [{
        route: $localize`:@@routes.error.not-found:stranica-nije-pronađena`,
        title: $localize`:@@routes.error.not-found.title:Marush: Space of Care - stranica nije pronađena`,
        message: $localize`:@@error.not-found.description:Dragi posetioče, tražena stranica ne postoji.`,
        image: '/assets/images/errors/decoration.svg'
    },
    {
        route: $localize`:@@routes.error.system:sistemska`,
        title: $localize`:@@routes.error.system.title:Marush: Space of Care - sistemska greška`,
        // eslint-disable-next-line @stylistic/max-len
        message: $localize`:@@error.system.description:Dragi posetioče, došlo je do sistemske greške. Administratori sajta su obavešteni o ovom problemu.`,
        image: '/assets/images/errors/decoration.svg'
    },
    {
        route: $localize`:@@routes.error.unauthorized:nemate-pristup`,
        title: $localize`:@@routes.error.unauthorized.title:Marush: Space of Care - nemate pravo pristupa`,
        message: $localize`:@@error.unauthorized.description:Dragi posetioče, nemate prava pristupa ovoj stranici.`,
        image: '/assets/images/home/consultations.svg'
    }];

    protected readonly currentError: { route: string; title: string; message: string; image: string };

    constructor(private readonly title: Title, private readonly route: ActivatedRoute) {
        const errorType = this.route.snapshot.paramMap.get('errorType');
        this.currentError = this.errors.find(error => error.route === errorType) || this.errors[0];

        this.title.setTitle(this.currentError.title);
    }
}
