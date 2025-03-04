/* eslint-disable @stylistic/max-len */
import { environment } from '@env';
import { IStructuredData, PageMetadata } from '@shared/components/page/base/page-metadata.model';
import { ILanguage } from '@shared/models/language.model';
import { MoneyPipe } from '@shared/pipes/money-pipe';

export const currentDiscounts = [
    $localize`:@@discounts.1:<h3><strong>3.3. - 8.3.</strong></h3><p>Vacuslim 48 (10 tretmana)<br/><br/><s>40.000</s> 28.000</p>`,
    $localize`:@@discounts.2:<h3><strong>3.3. - 8.3.</strong></h3><p>Vacuslim<br/><br/><s>4.000</s> 3.000</p>`,
    $localize`:@@discounts.3:<h3><strong>3.3. - 8.3.</strong></h3><p>Hijal. pen<br/><br/><s>5.000</s> 3.500</p>`,
    $localize`:@@discounts.4:<h3><strong>3.3. - 8.3.</strong></h3><p>Masaža lica + radio lifting + bio. tretman<br/><br/><s>6.000</s> 5.000</p>`
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
            datePosted: '2025-03-02',
            expires: '2025-03-08',
            category: $localize`:@@discounts.title:Ponuda ograničenog trajanja`,
            provider: this.marushSalon(),
            subjectOf: [
                this.offer($localize`:@@discounts.1:<h3><strong>3.3. - 8.3.</strong></h3><p>Vacuslim 48 (10 tretmana)<br/><br/><s>40.000</s> 28.000</p>`, '2025-03-08', '40000', '28000'),
                this.offer($localize`:@@discounts.2:<h3><strong>3.3. - 8.3.</strong></h3><p>Vacuslim<br/><br/><s>4.000</s> 3.000</p>`, '2025-03-08', '4000', '3000'),
                this.offer($localize`:@@discounts.3:<h3><strong>3.3. - 8.3.</strong></h3><p>Hijal. pen<br/><br/><s>5.000</s> 3.500</p>`, '2025-03-08', '5000', '3500'),
                this.offer($localize`:@@discounts.4:<h3><strong>3.3. - 8.3.</strong></h3><p>Masaža lica + radio lifting + bio. tretman<br/><br/><s>6.000</s> 5.000</p>`, '2025-03-08', '6000', '5000')
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
