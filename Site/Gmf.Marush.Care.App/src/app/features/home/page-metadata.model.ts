/* eslint-disable @stylistic/max-len */
import { environment } from '@env';
import { IStructuredData, PageMetadata } from '@shared/components/page/base/page-metadata.model';
import { ILanguage } from '@shared/models/language.model';
import { MoneyPipe } from '@shared/pipes/money-pipe';

export const currentDiscounts = [
    $localize`:@@discounts.1:<h3><strong>7.4. - 17.4.</strong></h3><p>Hem.piling + bio. tretman + lifting masaža<br/><br/><s>8.000</s> 6.500</p>`,
    $localize`:@@discounts.2:<h3><strong>7.4. - 17.4.</strong></h3><p>Neinv. mezoter. + radio talasi<br/><br/><s>8.000</s> 6.000</p>`,
    $localize`:@@discounts.3:<h3><strong>7.4. - 17.4.</strong></h3><p>Radio talasi + nano dermapen (bez perioda oporavka)<br/><br/><s>10.500</s> 8.000</p>`
];

export class HomePageMetadata extends PageMetadata {
    override pathTranslations = () => ({ en: 'home', sr: 'početna', ru: 'начальное' });
    override getTitle = () => $localize`:@@routes.home.title:Marush: Space of Care - početna` as string;
    override getKeywords = () => $localize`:@@routes.home.keywords:kozmetički salon,kozmeticki salon,salon lepote,nega lica,nega kože,otklanjanje akni,otklanjanje ožiljaka,tretmani hiperpigmentacije,tretmani lica popust,konsultacije,pregled kože,kućna nega lica,Beograd,Višegradska` as string;
    override getDescription = () => $localize`:@@routes.home.description:Kozmetički salon Marush: prostor za zdravlje i negu tela. U našem prijatnom okruženju u centru Beograda sprovodimo za Vas kozmetičke procedure nege kože i lica.` as string;

    override getSpecificStructuredData = (baseStructuredData: IStructuredData, _language: ILanguage) => {
        const specialAnnouncements = {
            '@type': 'SpecialAnnouncement',
            '@id': this.marushId('discounts'),
            announcementLocation: this.marushSalon(),
            name: $localize`:@@discounts.title:Ponuda ograničenog trajanja`,
            text: $localize`:@@discounts.contact:Kontaktirajte nas za više detalja!`,
            url: environment.url,
            datePosted: '2025-04-07',
            expires: '2025-04-17',
            category: $localize`:@@discounts.title:Ponuda ograničenog trajanja`,
            provider: this.marushSalon(),
            subjectOf: [
                this.offer($localize`:@@discounts.1:<h3><strong>7.4. - 17.4.</strong></h3><p>Hem.piling + bio. tretman + lifting masaža<br/><br/><s>8.000/s> 6.500</p>`, '2025-04-17', '8000', '6500'),
                this.offer($localize`:@@discounts.2:<h3><strong>7.4. - 17.4.</strong></h3><p>Neinv. mezoter. + radio talasi<br/><br/><s>8.000</s> 6.000</p>`, '2025-04-17', '8000', '6000'),
                this.offer($localize`:@@discounts.3:<h3><strong>7.4. - 17.4.</strong></h3><p>Radio talasi + nano dermapen (bez perioda oporavka)<br/><br/><s>10.500</s> 8.000</p>`, '2025-04-17', '10500', '8000')
            ]
        };

        this.getGraphFrom(baseStructuredData).push(specialAnnouncements);
        return baseStructuredData;
    };

    private readonly priceSpecification = (originalPrice: string, discountedPrice: string) =>
        [
            {
                '@type': 'UnitPriceSpecification',
                price: new MoneyPipe().transform(originalPrice),
                priceCurrency: 'RSD',
                valueAddedTaxIncluded: true,
                eligibleTransactionVolume: {
                    '@type': 'PriceSpecification',
                    name: 'Original Price'
                }
            },
            {
                '@type': 'UnitPriceSpecification',
                price: new MoneyPipe().transform(discountedPrice),
                priceCurrency: 'RSD',
                valueAddedTaxIncluded: true,
                eligibleTransactionVolume: {
                    '@type': 'PriceSpecification',
                    name: 'Discounted Price'
                }
            }
        ];

    private readonly offer = (name: string, priceValidUntil: string, originalPrice: string, price: string) => ({
            '@type': 'Offer',
            name,
            availability: 'https://schema.org/InStock',
            priceValidUntil,
            priceCurrency: 'RSD',
            price: new MoneyPipe().transform(price),
            priceSpecification: this.priceSpecification(originalPrice, price)
        });
}
