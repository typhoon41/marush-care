import { PageMetadata } from './page-metadata.model';

export abstract class BasePageComponent {
  constructor(private readonly metadata: PageMetadata) {
    this.metadata.attachMetadata();
  }
}
