/* eslint-disable max-lines */
/* eslint-disable capitalized-comments */
/* eslint-disable @stylistic/max-len */
import { IStructuredData, PageMetadata } from '@shared/components/page/base/page-metadata.model';

export const currentDiscounts = [
    $localize`:@@discounts.1:<p><strong>3.2. - 15.2.</strong></p><p>PRX-T33<br/><br/><s>13.500</s> 10.000</p>`,
    $localize`:@@discounts.2:<p><strong>3.2. - 15.2.</strong></p><p>Premium higij. + dermapen<br/><br/><s>13.500</s> 10.000</p>`,
    $localize`:@@discounts.3:<p><strong>3.2. - 15.2.</strong></p><p>Mikro dermo abr.<br/><br/><s>7.500</s> 6.000</p>`
];

export class HomePageMetadata extends PageMetadata {
    override pathTranslations = () => { return { en: 'home', sr: 'početna', ru: 'начальное' }; };
    override getTitle = () => $localize`:@@routes.home.title:Marush: Space of Care - početna` as string;
    override getKeywords = () => $localize`:@@routes.home.keywords:kozmetički salon,kozmeticki salon,salon lepote,nega lica,nega kože,otklanjanje akni,otklanjanje ožiljaka,tretmani hiperpigmentacije,tretmani lica popust,konsultacije,pregled kože,kućna nega lica,Beograd,Višegradska` as string;
    override getDescription = () => $localize`:@@routes.home.description:Kozmetički salon Marush: prostor za zdravlje i negu tela. U našem prijatnom okruženju u centru Beograda sprovodimo za Vas kozmetičke procedure nege kože i lica.` as string;

    // eslint-disable-next-line max-lines-per-function
    override getSpecificStructuredData = (baseStructuredData: IStructuredData) => {
        const specialAnnouncements = {
            '@type': 'SpecialAnnouncement',
            '@id': 'https://marushcare.com/#discounts',
            announcementLocation: {
                '@type': 'BeautySalon',
                name: 'Marush: Space of Care'
            },
            name: $localize`:@@discounts.title:Ponuda ograničenog trajanja`,
            text: $localize`:@@discounts.contact:Kontaktirajte nas za više detalja!`,
            url: 'https://marushcare.com',
            datePosted: '2025-02-07',
            expires: '2025-02-15',
            category: $localize`:@@discounts.title:Ponuda ograničenog trajanja`,
            provider: {
                '@type': 'BeautySalon',
                name: 'Marush: Space of Care'
            },
            subjectOf: [{
                '@type': 'Offer',
                name: $localize`:@@treatments.face.prx-t33:PRX T33 piling`,
                availability: 'https://schema.org/InStock',
                priceValidUntil: '2025-02-15',
                priceCurrency: 'RSD',
                price: '10.000',
                priceSpecification: [
                    {
                        '@type': 'UnitPriceSpecification',
                        price: '13.500',
                        priceCurrency: 'RSD',
                        valueAddedTaxIncluded: true,
                        eligibleTransactionVolume: {
                            '@type': 'PriceSpecification',
                            name: 'Original Price'
                        }
                    },
                    {
                        '@type': 'UnitPriceSpecification',
                        price: '10.000',
                        priceCurrency: 'RSD',
                        valueAddedTaxIncluded: true,
                        eligibleTransactionVolume: {
                            '@type': 'PriceSpecification',
                            name: 'Discounted Price'
                        }
                    }
                ]
            },
            {
                '@type': 'Offer',
                name: `${$localize`:@@treatments.face.premium-hygiene.regular:Premium higijenski tretman`} + ${$localize`:@@treatments.face.dermapen:Dermapen`}`,
                availability: 'https://schema.org/InStock',
                priceValidUntil: '2025-02-15',
                priceCurrency: 'RSD',
                price: '10.000',
                priceSpecification: [
                    {
                        '@type': 'UnitPriceSpecification',
                        price: '13.500',
                        priceCurrency: 'RSD',
                        valueAddedTaxIncluded: true,
                        eligibleTransactionVolume: {
                            '@type': 'PriceSpecification',
                            name: 'Original Price'
                        }
                    },
                    {
                        '@type': 'UnitPriceSpecification',
                        price: '10.000',
                        priceCurrency: 'RSD',
                        valueAddedTaxIncluded: true,
                        eligibleTransactionVolume: {
                            '@type': 'PriceSpecification',
                            name: 'Discounted Price'
                        }
                    }
                ]
            },
            {
                '@type': 'Offer',
                name: $localize`:@@treatments.face.microdermabrasion:Mikrodermoabrazija`,
                availability: 'https://schema.org/InStock',
                priceValidUntil: '2025-02-15',
                priceCurrency: 'RSD',
                price: '6.000',
                priceSpecification: [
                    {
                        '@type': 'UnitPriceSpecification',
                        price: '7.500',
                        priceCurrency: 'RSD',
                        valueAddedTaxIncluded: true,
                        eligibleTransactionVolume: {
                            '@type': 'PriceSpecification',
                            name: 'Original Price'
                        }
                    },
                    {
                        '@type': 'UnitPriceSpecification',
                        price: '10.000',
                        priceCurrency: 'RSD',
                        valueAddedTaxIncluded: true,
                        eligibleTransactionVolume: {
                            '@type': 'PriceSpecification',
                            name: 'Discounted Price'
                        }
                    }
                ]
            }]
        };

        baseStructuredData['@graph'].push(specialAnnouncements);
        return baseStructuredData;
    };
}
