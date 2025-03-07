import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '@env';
import { BasePageComponent } from '@shared/components/page/base/base-page.component';
import { PageMetadataService } from '@shared/services/metadata/page-metadata.service';
import { HomeDiscountsComponent } from './discounts/discounts.component';
import { HomeHeroComponent } from './hero/hero.component';
import { HomeInstagramComponent } from './instagram/instagram.component';
import { HomePageMetadata } from './page-metadata.model';
import { HomeServicesComponent } from './services/services.component';
import { HomeSpaceComponent } from './space/space.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-home-page',
  imports: [HomeHeroComponent, HomeSpaceComponent, NgOptimizedImage,
    HomeServicesComponent, HomeInstagramComponent, HomeDiscountsComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent extends BasePageComponent {
  readonly mainImageUrl = `${environment.staticContentUrl}images/home/main.png`;

  constructor(protected override readonly metadataService: PageMetadataService) {
    super(metadataService, new HomePageMetadata());
  }
}
