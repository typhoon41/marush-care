import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeHeroComponent } from './hero/hero.component';
import { HomeSpaceComponent } from './space/space.component';

@Component({
    selector: 'app-home-page',
    standalone: true,
    imports: [RouterOutlet, HomeHeroComponent, HomeSpaceComponent],
    templateUrl: './home-page.component.html',
    styleUrl: './home-page.component.scss'
  })
  export class HomePageComponent {
  }

