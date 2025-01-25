/* eslint-disable @stylistic/max-len */
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PageMetadata } from '@shared/components/page/base/page-metadata.model';

export class HomePageMetadata extends PageMetadata {
    override getTitle = () => $localize`:@@routes.home.title:Marush: Space of Care - početna` as string;
    override getKeywords = () => $localize`:@@routes.home.keywords:kozmetički salon,kozmeticki salon,salon lepote,nega lica,nega kože,otklanjanje akni,otklanjanje ožiljaka,tretmani hiperpigmentacije,tretmani lica popust,konsultacije,pregled kože,kućna nega lica,Beograd,Višegradska` as string;
    override getDescription = () => $localize`:@@routes.home.description:Kozmetički salon Marush: prostor za zdravlje i negu tela. U našem prijatnom okruženju u centru Beograda sprovodimo za Vas kozmetičke procedure nege kože i lica.` as string;

    constructor(protected override readonly locale: string, protected override readonly router: Router,
         protected override readonly meta: Meta, protected override readonly title: Title) {
        super(locale, router, meta, title);
    }
}
