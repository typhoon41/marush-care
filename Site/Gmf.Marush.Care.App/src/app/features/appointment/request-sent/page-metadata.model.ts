import { IStructuredData, PageMetadata } from '@shared/components/page/base/page-metadata.model';
import { ILanguage } from '@shared/models/language.model';
import marushDetails from '@shared/models/marush-details.model';
import { IRepresentUserRequest } from './request-user.model';

export class RequestSentPageMetadata extends PageMetadata {
  override pathTranslations = () => { return { en: 'request-sent', sr: 'zahtev-poslat', ru: 'запрос-отправлен' }; };
  override getTitle = () => '';
  override getKeywords = () => '';
  override getDescription = () => '';

  constructor(private readonly user: IRepresentUserRequest) {
    super();
  }

  override getSpecificStructuredData = (baseStructuredData: IStructuredData, _language: ILanguage) => {
    if (!this.user) {
      return baseStructuredData;
    }

    const scheduleAction = this.getScheduleAction();
    this.getGraphFrom(baseStructuredData).push(scheduleAction);
    return baseStructuredData;
  };

  private readonly getScheduleAction = () => {
    return {
      '@context': 'https://schema.org',
      '@type': 'ScheduleAction',
      agent: {
        '@type': 'Person',
        name: this.user.fullName,
        email: this.user.email,
        telephone: this.user.phone
      },
      object: {
        '@type': 'Service',
        name: this.user.services,
        offers: {
          '@type': 'Offer',
          price: this.user.sum,
          priceCurrency: 'RSD'
        }
      },
      scheduledTime: this.user.time,
      location: {
        '@type': 'Place',
        name: marushDetails.name,
        address: {
          ...this.address(),
          streetAddress: $localize`:@@contact.address:Višegradska 25/7`
        }
      }
    };
  };
}
