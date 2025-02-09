import { IStructuredData, PageMetadata } from './page-metadata.model';

export abstract class ServicesMetadata extends PageMetadata {
    protected readonly addDefaultServices = (baseStructuredData: IStructuredData) => {
        const itemList = {
            '@type': 'ItemList',
            name: this.capitalize($localize`:@@routes.services:usluge`),
            itemListElement: [
                this.serviceFrom('facial', $localize`:@@services.treatments.title:Tretmani Lica`),
                this.serviceFrom('combination', $localize`:@@services.treatments-combination.title:Kombinacije Tretmana`),
                this.serviceFrom('brows-lashes', $localize`:@@services.brows-lashes.title:Obrve i Trepavice`),
                this.serviceFrom('waxing', $localize`:@@services.waxing.title:Depilacija`),
                this.serviceFrom('body', $localize`:@@services.body.title:Tretmani tela`),
                this.serviceFrom('massages', $localize`:@@services.massage.title:Masaže`)
            ]
        };

        this.getGraphFrom(baseStructuredData).push(itemList);
        return baseStructuredData;
    };

    private readonly serviceFrom = (serviceName: string, description: string) => {
        return {
            '@type': 'Service',
            '@id': this.marushId(`services-${serviceName}`),
            name: description
        };
    };
}
