import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeHeroComponent } from './hero/hero.component';
import { HomeInstagramComponent } from './instagram/instagram.component';
import { HomeServicesComponent } from './services/services.component';
import { HomeSpaceComponent } from './space/space.component';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [RouterOutlet, HomeHeroComponent, HomeSpaceComponent, HomeServicesComponent, HomeInstagramComponent],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss'
  })
  export class HomePageComponent {
  }

