/* eslint-disable @stylistic/max-len */
import { environment } from '@env';
import { IStructuredData, PageMetadata } from '@shared/components/page/base/page-metadata';
import { ILanguage } from '@shared/models/language';
import { Money } from '@shared/pipes/money';

export const currentDiscounts = [
    $localize`:@@discounts.1:<h3><strong>9.11. - 27.11.</strong></h3><p>Prem. higij. tret. + Dermapen<br/><br/><s>11.500</s> 9.500</p>`,
    $localize`:@@discounts.2:<h3><strong>9.11. - 27.11.</strong></h3><p>PRX-T33 + Dermapen<br/><br/><s>12.500</s> 10.000</p>`,
    $localize`:@@discounts.3:<h3><strong>9.11. - 27.11.</strong></h3><p>Voćne kisel. + Dermapen<br/><br/><s>9.500</s> 8.000</p>`
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
            datePosted: '2026-11-09',
            expires: '2026-11-27',
            category: $localize`:@@discounts.title:Ponuda ograničenog trajanja`,
            provider: this.marushSalon(),
            subjectOf: [
                this.offer(currentDiscounts[0], '2026-11-27', '11500', '9500'),
                this.offer(currentDiscounts[1], '2026-11-27', '12500', '10000'),
                this.offer(currentDiscounts[2], '2026-11-27', '9500', '8000')
            ]
        };

        this.getGraphFrom(baseStructuredData).push(specialAnnouncements);
        return baseStructuredData;
    };

    private readonly priceSpecification = (originalPrice: string, discountedPrice: string) =>
        [
            {
                '@type': 'UnitPriceSpecification',
                price: new Money().transform(originalPrice),
                priceCurrency: 'RSD',
                valueAddedTaxIncluded: true,
                eligibleTransactionVolume: {
                    '@type': 'PriceSpecification',
                    name: 'Original Price'
                }
            },
            {
                '@type': 'UnitPriceSpecification',
                price: new Money().transform(discountedPrice),
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
            price: new Money().transform(price),
            priceSpecification: this.priceSpecification(originalPrice, price)
        });
}
