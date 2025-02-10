/* eslint-disable @stylistic/max-len */
import { IStructuredData } from '@shared/components/page/base/page-metadata.model';
import { ServicesMetadata } from '@shared/components/page/base/services-metadata.model';
import { ILanguage } from '@shared/models/language.model';

export class AppointmentPageMetadata extends ServicesMetadata {
    override pathTranslations = () => { return { en: 'appointment', sr: 'zakazivanje', ru: 'назначение' }; };
    override getTitle = () => $localize`:@@routes.appointment.title:Marush: Space of Care - zakazivanje` as string;
    override getKeywords = () => $localize`:@@routes.appointment.keywords:kozmetički salon,salon lepote,nega lica,obrve,trepavice,kombinacije tretmana,lifting,masaža,zakazivanje,slobodan termin,centar,Beograd,Višegradska` as string;
    override getDescription = () => $localize`:@@routes.appointment.description:Zakazivanje vašeg termina u Marush salonu je brzo i lako. Izaberite željenu uslugu, odgovarajuće vreme i prepustite našem stručnom timu sve preostalo.` as string;

    override getSpecificStructuredData = (baseStructuredData: IStructuredData, language: ILanguage) => {
        const defaultServiceData = this.addDefaultServices(baseStructuredData, $localize`:@@routes.appointment:zakazivanje`);
        const webSite = this.getGraphFrom(defaultServiceData)[1] as { potentialAction: unknown[] };
        const requestSentUrl = this.localizedUrl(language.value, $localize`:@@routes.appointment.requested:zahtev-poslat`);
        const scheduleAction = {
            '@type': 'ScheduleAction',
            name: $localize`:@@routes.appointment.metadata.request:Pošaljite zahtev za rezervaciju termina`,
            target: requestSentUrl,
            result: {
                '@type': 'CreativeWork',
                name: $localize`:@@routes.appointment.metadata.response:Vaš zahtev za rezervaciju termina je poslat`,
                url: requestSentUrl
            }
        };

        webSite.potentialAction.push(scheduleAction);
        return defaultServiceData;
    };
}
