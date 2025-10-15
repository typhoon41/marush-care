import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '@env';
import { BasePage } from '@shared/components/page/base/base-page';
import { Stapler } from '@shared/services/metadata/stapler';
import { HomeDiscounts } from './discounts/discounts';
import { HomeHero } from './hero/hero';
import { HomeInstagram } from './instagram/instagram';
import { HomePageMetadata } from './page-metadata.model';
import { HomeServices } from './services/services';
import { HomeSpace } from './space/space';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-home-page',
  imports: [HomeHero, HomeSpace, NgOptimizedImage, HomeServices, HomeInstagram, HomeDiscounts],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss'
})
export class HomePage extends BasePage {
  protected readonly mainImageUrl = `${environment.staticContentUrl}images/home/main.png`;

  constructor(protected override readonly stapler: Stapler) {
    super(stapler, new HomePageMetadata());
  }
}
