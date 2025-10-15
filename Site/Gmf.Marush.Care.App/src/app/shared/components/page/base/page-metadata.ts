/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { environment } from '@env';
import { ILanguage, SupportedLanguage } from '@shared/models/language';
import marushDetails from '@shared/models/marush-details';

export interface IStructuredData {
    '@graph': unknown[];
}

export abstract class PageMetadata {
    abstract getTitle: () => string;
    abstract getDescription: () => string;
    abstract getKeywords: () => string;
    abstract pathTranslations: () => Record<SupportedLanguage, string>;
    abstract getSpecificStructuredData: (baseStructuredData: IStructuredData, language: ILanguage) => IStructuredData;

    protected readonly marushId = (id: string) => `${environment.url}/#${id}`;
    protected readonly marushSalon = () => ({
            '@type': 'BeautySalon',
            name: marushDetails.name,
            url: environment.url
        });

    readonly localizedPageUrl = (desiredLanguage: SupportedLanguage) =>
        this.localizedUrl(desiredLanguage, this.pathTranslations()[desiredLanguage]);

    readonly getStructuredData = (language: ILanguage) =>
        this.getSpecificStructuredData(this.baseStructuredData(language), language);

    private readonly baseStructuredData = (language: ILanguage) => ({
            '@context': 'https://schema.org',
            '@graph': [
                {
                    ...this.marushSalon(),
                    '@id': this.marushId('salon'),
                    currenciesAccepted: 'RSD',
                    paymentAccepted: 'Cash, Credit Card',
                    image: `${environment.staticContentUrl}/images/home/main.png`,
                    telephone: marushDetails.phoneNumberAction.substring(4),
                    email: marushDetails.email,
                    logo: `${environment.url}/assets/images/logo.png`,
                    founder: {
                        '@type': 'Person',
                        givenName: 'Marija',
                        familyName: 'Dragićević'
                    },
                    address: this.address(),
                    openingHours: 'Mo-Sa 12:00-20:00',
                    priceRange: '500RSD - 15000RSD'
                },
                {
                    '@type': 'WebSite',
                    '@id': this.marushId('website'),
                    name: marushDetails.name,
                    inLanguage: language.iso.replace('_', '-').replace(/(-[^-]+)$/u, ''),
                    maintainer: {
                        '@type': 'Person',
                        givenName: 'Nikola',
                        familyName: 'Dragićević'
                    },
                    url: environment.url,
                    publisher: {
                        '@id': this.marushId('salon')
                    },
                    potentialAction: [
                        this.addLinkWith($localize`:@@routes.home:početna`, language),
                        this.addLinkWith($localize`:@@routes.services:usluge`, language),
                        this.addLinkWith($localize`:@@routes.gallery:galerija`, language),
                        this.addLinkWith($localize`:@@routes.appointment:zakazivanje`, language),
                        this.addLinkWith($localize`:@@routes.contact:kontakt`, language),
                        {
                            '@type': 'DownloadAction',
                            name: this.capitalize($localize`:@@pricelist:cenovnik | PDF`),
                            target: marushDetails.priceListUrl()
                        },
                        {
                            '@type': 'ChooseAction',
                            actionOption: [
                                this.addLanguage('Serbian', 'sr'),
                                this.addLanguage('English', 'en'),
                                this.addLanguage('Russian', 'ru')
                            ]
                        },
                        {
                            '@type': 'CommunicateAction',
                            name: $localize`:@@routes.contact.call:Pozovite salon`,
                            recipient: {
                                '@type': 'BeautySalon',
                                name: marushDetails.name,
                                telephone: marushDetails.phoneNumberAction.substring(4)
                            }
                        },
                        {
                            '@type': 'AskAction',
                            name: $localize`:@@routes.contact.email:Pošaljite mail salonu`,
                            recipient: {
                                '@type': 'BeautySalon',
                                name: marushDetails.name,
                                email: marushDetails.email
                            }
                        }
                    ]
                }]
        });

    protected readonly getGraphFrom = (baseStructuredData: IStructuredData) => baseStructuredData['@graph'];

    protected readonly address = () => ({
            '@type': 'PostalAddress',
            addressLocality: `${$localize`:@@contact.city:Beograd`} - Savski Venac`,
            addressRegion: $localize`:@@contact.city:Beograd`,
            postalCode: '11129',
            addressCountry: {
                '@type': 'Country',
                name: 'Republic of Serbia'
            }
        });

    protected readonly capitalize = (value: unknown) => String(value).charAt(0)
        .toUpperCase() + String(value).slice(1);

    protected readonly localizedUrl = (desiredLanguage: SupportedLanguage, path: string) =>
        `${environment.url}/${desiredLanguage}/${path}`;

    private readonly addLanguage = (fullName: string, shortName: string) => ({
            '@type': 'Language',
            name: fullName,
            alternateName: shortName
        });

    private readonly addLinkWith = (label: string, language: ILanguage) => ({
            '@type': 'ViewAction',
            name: this.capitalize(label),
            target: this.localizedUrl(language.value, label)
        });
}
