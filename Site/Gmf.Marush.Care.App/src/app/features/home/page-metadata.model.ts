/* eslint-disable @stylistic/max-len */
import { PageMetadata } from '@shared/components/page/base/page-metadata.model';

export class HomePageMetadata extends PageMetadata {
    override pathTranslations = () => { return { en: 'home', sr: 'početna', ru: 'начальное' }; };
    override getTitle = () => $localize`:@@routes.home.title:Marush: Space of Care - početna` as string;
    override getKeywords = () => $localize`:@@routes.home.keywords:kozmetički salon,kozmeticki salon,salon lepote,nega lica,nega kože,otklanjanje akni,otklanjanje ožiljaka,tretmani hiperpigmentacije,tretmani lica popust,konsultacije,pregled kože,kućna nega lica,Beograd,Višegradska` as string;
    override getDescription = () => $localize`:@@routes.home.description:Kozmetički salon Marush: prostor za zdravlje i negu tela. U našem prijatnom okruženju u centru Beograda sprovodimo za Vas kozmetičke procedure nege kože i lica.` as string;
    // eslint-disable-next-line max-lines-per-function
    override getStructuredData = () => {
        return {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'BeautySalon',
                    '@id': 'https://example.com/#beautysalon',
                    name: 'Your Salon Name',
                    url: 'https://example.com',
                    image: 'https://example.com/logo.png',
                    telephone: '+1-234-567-890',
                    email: 'contact@example.com',
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: '123 Main St',
                        addressLocality: 'City Name',
                        addressRegion: 'State',
                        postalCode: '12345',
                        addressCountry: 'US'
                    },
                    openingHours: 'Mo-Sa 09:00-19:00',
                    priceRange: '$$'
                },
                {
                    '@type': 'WebSite',
                    '@id': 'https://example.com/#website',
                    name: 'Your Salon Name',
                    url: 'https://example.com',
                    publisher: {
                        '@id': 'https://example.com/#beautysalon'
                    },
                    potentialAction: {
                        '@type': 'SearchAction',
                        target: 'https://example.com/search?q={search_term_string}',
                        'query-input': 'required name=search_term_string'
                    }
                },
                {
                    '@type': 'SpecialAnnouncement',
                    '@id': 'https://example.com/#discounts',
                    name: 'Limited-Time Discounts!',
                    text: 'Get 20% off all facials this month.',
                    url: 'https://example.com/offers',
                    datePosted: '2025-01-27',
                    expires: '2025-02-28',
                    category: 'https://schema.org/DiscountOffer'
                }
            ]
        };
    };
}
