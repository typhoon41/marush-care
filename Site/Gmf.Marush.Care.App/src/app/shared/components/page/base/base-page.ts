import { inject } from '@angular/core';
import { Stapler } from '@shared/services/metadata/stapler';
import { PageMetadata } from './page-metadata';

export abstract class BasePage {
  private readonly stapler = inject(Stapler);

  constructor(metadata: PageMetadata) {
    this.stapler.attach(metadata);
  }
}
