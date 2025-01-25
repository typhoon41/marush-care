import { NgOptimizedImage } from '@angular/common';
import { Component, Inject, LOCALE_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { environment } from '@env';
import { BasePageComponent } from '@shared/components/page/base/base-page.component';
import { HomeDiscountsComponent } from './discounts/discounts.component';
import { HomeHeroComponent } from './hero/hero.component';
import { HomeInstagramComponent } from './instagram/instagram.component';
import { HomePageMetadata } from './page-metadata.model';
import { HomeServicesComponent } from './services/services.component';
import { HomeSpaceComponent } from './space/space.component';

@Component({
  selector: 'marush-home-page',
  imports: [HomeHeroComponent, HomeSpaceComponent, NgOptimizedImage,
    HomeServicesComponent, HomeInstagramComponent, HomeDiscountsComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent extends BasePageComponent {
  readonly mainImageUrl = `${environment.staticContentUrl}images/home/main.png`;

  constructor(protected readonly router: Router, @Inject(LOCALE_ID) protected readonly locale: string,
  protected readonly meta: Meta, protected readonly title: Title) {
    super(new HomePageMetadata(locale, router, meta, title));
  }
}
