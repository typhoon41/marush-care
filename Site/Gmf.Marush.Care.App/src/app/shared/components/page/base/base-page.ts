import { Stapler } from '@shared/services/metadata/stapler';
import { PageMetadata } from './page-metadata';

export abstract class BasePage {
  constructor(protected readonly stapler: Stapler, protected readonly metadata: PageMetadata) {
    this.stapler.attach(metadata);
  }
}
