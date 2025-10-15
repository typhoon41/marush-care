import { Stapler } from '@shared/services/metadata/stapler';
import { PageMetadata } from './page-metadata';

export abstract class BasePage {
  constructor(protected readonly metadataService: Stapler, protected readonly metadata: PageMetadata) {
    this.metadataService.attach(metadata);
  }
}
