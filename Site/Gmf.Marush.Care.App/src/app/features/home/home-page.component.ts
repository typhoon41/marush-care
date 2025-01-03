/* eslint-disable @stylistic/max-len */
import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '@env';
import { HomeDiscountsComponent } from './discounts/discounts.component';
import { HomeHeroComponent } from './hero/hero.component';
import { HomeInstagramComponent } from './instagram/instagram.component';
import { HomeServicesComponent } from './services/services.component';
import { HomeSpaceComponent } from './space/space.component';

@Component({
  selector: 'marush-home-page',
  imports: [HomeHeroComponent, HomeSpaceComponent, NgOptimizedImage,
    HomeServicesComponent, HomeInstagramComponent, HomeDiscountsComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  readonly mainImageUrl = `${environment.staticContentUrl}images/home/main.png`;

  constructor(private readonly meta: Meta, private readonly title: Title) {
    this.meta.updateTag({ name: 'description', content: $localize`:@@routes.home.description:Kozmetički salon Marush: prostor za zdravlje i negu tela. U našem prijatnom okruženju u centru Beograda sprovodimo za Vas kozmetičke procedure nege kože i lica.` });
    this.meta.updateTag({ name: 'keywords', content: $localize`:@@routes.home.keywords:kozmetički salon,kozmeticki salon,salon lepote,nega lica,nega kože,otklanjanje akni,otklanjanje ožiljaka,tretmani hiperpigmentacije,tretmani lica popust,konsultacije,pregled kože,kućna nega lica,Beograd,Višegradska` });
    this.title.setTitle($localize`:@@routes.home.title:Marush: Space of Care - početna`);
  }
}
