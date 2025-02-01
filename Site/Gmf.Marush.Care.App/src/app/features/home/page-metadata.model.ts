/* eslint-disable capitalized-comments */
/* eslint-disable @stylistic/max-len */
import { IStructuredData, PageMetadata } from '@shared/components/page/base/page-metadata.model';

export const currentDiscounts = [];

export class HomePageMetadata extends PageMetadata {
    override pathTranslations = () => { return { en: 'home', sr: 'početna', ru: 'начальное' }; };
    override getTitle = () => $localize`:@@routes.home.title:Marush: Space of Care - početna` as string;
    override getKeywords = () => $localize`:@@routes.home.keywords:kozmetički salon,kozmeticki salon,salon lepote,nega lica,nega kože,otklanjanje akni,otklanjanje ožiljaka,tretmani hiperpigmentacije,tretmani lica popust,konsultacije,pregled kože,kućna nega lica,Beograd,Višegradska` as string;
    override getDescription = () => $localize`:@@routes.home.description:Kozmetički salon Marush: prostor za zdravlje i negu tela. U našem prijatnom okruženju u centru Beograda sprovodimo za Vas kozmetičke procedure nege kože i lica.` as string;

    // eslint-disable-next-line max-lines-per-function
    override getSpecificStructuredData = (baseStructuredData: IStructuredData) =>
        // const specialAnnouncements = {
        //     '@type': 'SpecialAnnouncement',
        //     '@id': 'https://marushcare.com/#discounts',
        //     name: $localize`:@@discounts.title:Ponuda ograničenog trajanja`,
        //     url: 'https://marushcare.com',
        //     datePosted: '2025-01-27',
        //     expires: '2025-02-28',
        //     category: 'https://schema.org/DiscountOffer',
        //     provider: {
        //         '@type': 'BeautySalon',
        //         name: 'Marush: Space of Care'
        //     },
        //     subjectOf: [{
        //         '@type': 'Offer',
        //         name: 'Luxury Facial Treatment',
        //         availability: 'https://schema.org/InStock',
        //         priceValidUntil: '2025-03-01',
        //         priceCurrency: 'RSD',
        //         price: '4000',
        //         priceSpecification: [
        //             {
        //               '@type': 'UnitPriceSpecification',
        //               price: '6000',
        //               priceCurrency: 'RSD',
        //               valueAddedTaxIncluded: true,
        //               eligibleTransactionVolume: {
        //                 '@type': 'PriceSpecification',
        //                 name: 'Original Price'
        //               }
        //             },
        //             {
        //               '@type': 'UnitPriceSpecification',
        //               price: '4000',
        //               priceCurrency: 'RSD',
        //               valueAddedTaxIncluded: true,
        //               eligibleTransactionVolume: {
        //                 '@type': 'PriceSpecification',
        //                 name: 'Discounted Price'
        //               }
        //             }
        //           ]
        //     }]
        // };

        // baseStructuredData['@graph'].push(specialAnnouncements);
         baseStructuredData
    ;
}
