import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RouteTranslatorPipe } from '@shared/pipes/routing-translator-pipe';

@Component({
    selector: 'marush-home-hero',
    imports: [RouterModule],
    templateUrl: './hero.component.html',
    styleUrl: './hero.component.scss'
  })
  export class HomeHeroComponent {
    constructor(private readonly router: Router, private readonly routeTranslatorPipe: RouteTranslatorPipe) { }

    readonly redirectToAppointments = async() => {
      await this.router.navigate([this.routeTranslatorPipe.transform('appointment')]);
    };
  }
