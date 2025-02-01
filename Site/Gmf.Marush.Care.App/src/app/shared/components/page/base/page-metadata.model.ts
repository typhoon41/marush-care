/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { environment } from '@env';
import { ILanguage, SupportedLanguage } from '@shared/models/language.model';
import marushDetails from '@shared/models/marush-details.model';

export interface IStructuredData {
    '@graph': unknown[];
}

export abstract class PageMetadata {
    abstract getTitle: () => string;
    abstract getDescription: () => string;
    abstract getKeywords: () => string;
    abstract pathTranslations: () => Record<SupportedLanguage, string>;
    abstract getSpecificStructuredData: (baseStructuredData: IStructuredData) => IStructuredData;

    readonly localizedUrl = (desiredLanguage: SupportedLanguage) =>
        `${environment.url + desiredLanguage}/${this.pathTranslations()[desiredLanguage]}`;

    readonly getStructuredData = (language: ILanguage) =>
        this.getSpecificStructuredData(this.baseStructuredData(language));

    private readonly baseStructuredData = (language: ILanguage) => {
        return {
            '@context': 'https://schema.org',
            '@graph': [
                {
                    '@type': 'BeautySalon',
                    '@id': 'https://marushcare.com/#salon',
                    name: 'Marush: Space of Care',
                    currenciesAccepted: 'RSD',
                    paymentAccepted: 'Cash, Credit Card',
                    url: 'https://marushcare.com',
                    image: 'https://marushcare.com/files/images/home/main.png',
                    telephone: marushDetails.phoneNumberAction.substring(4),
                    email: marushDetails.email,
                    logo: 'https://marushcare.com/assets/images/logo.png',
                    founder: {
                        '@type': 'Person',
                        givenName: 'Marija',
                        familyName: 'Dragićević'
                    },
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: $localize`:@@contact.address:Višegradska 25/7`,
                        addressLocality: `${$localize`:@@contact.city:Beograd`} - Savski Venac`,
                        addressRegion: $localize`:@@contact.city:Beograd`,
                        postalCode: '11129',
                        addressCountry: 'RS'
                    },
                    openingHours: 'Mo-Sa 12:00-20:00',
                    priceRange: '500RSD - 15000RSD'
                },
                {
                    '@type': 'WebSite',
                    '@id': 'https://marushcare.com/#website',
                    name: 'Marush: Space of Care',
                    inLanguage: language.iso.replace('_', '-').replace(/(-[^-]+)$/u, ''),
                    maintainer: {
                        '@type': 'Person',
                        givenName: 'Nikola',
                        familyName: 'Dragićević'
                    },
                    url: 'https://marushcare.com',
                    publisher: {
                        '@id': 'https://marushcare.com/#salon'
                    },
                    potentialAction: [
                        this.addLinkWith($localize`:@@routes.home:početna`, language),
                        this.addLinkWith($localize`:@@routes.services:usluge`, language),
                        this.addLinkWith($localize`:@@routes.gallery:galerija`, language),
                        this.addLinkWith($localize`:@@routes.appointment:zakazivanje`, language),
                        this.addLinkWith($localize`:@@routes.contact:kontakt`, language),
                        {
                            '@type': 'DownloadAction',
                            name: this.capitalize($localize`:@@pricelist:cenovnik`),
                            target: marushDetails.priceListUrl()
                        },
                        {
                            '@type': 'ChooseAction',
                            actionOption: [
                                {
                                    '@type': 'Language',
                                    name: 'Serbian',
                                    alternateName: 'sr'
                                },
                                {
                                    '@type': 'Language',
                                    name: 'English',
                                    alternateName: 'en'
                                },
                                {
                                    '@type': 'Language',
                                    name: 'Russian',
                                    alternateName: 'ru'
                                }
                            ]
                        },
                        {
                            '@type': 'CommunicateAction',
                            name: $localize`:@@routes.contact.call:Pozovite salon`,
                            recipient: {
                                '@type': 'BeautySalon',
                                name: 'Marush: Space of Care',
                                telephone: marushDetails.phoneNumberAction.substring(4)
                            }
                        },
                        {
                            '@type': 'AskAction',
                            name: $localize`:@@routes.contact.email:Pošaljite mail salonu`,
                            recipient: {
                                '@type': 'BeautySalon',
                                name: 'Marush: Space of Care',
                                email: marushDetails.email
                            }
                        }
                    ]
                }]
        };
    };

    private readonly capitalize = (value: string) => String(value).charAt(0)
        .toUpperCase() + String(value).slice(1);

    private readonly addLinkWith = (label: string, language: ILanguage) => {
        return {
            '@type': 'ViewAction',
            name: this.capitalize(label),
            target: `https://marushcare.com/${language.value}/${label}`
        };
    };
}
