import { PageMetadataService } from '@shared/services/page-metadata.service';
import { PageMetadata } from './page-metadata.model';

export abstract class BasePageComponent {
  constructor(protected readonly metadataService: PageMetadataService, protected readonly metadata: PageMetadata) {
    this.metadataService.attach(metadata);
  }
}
