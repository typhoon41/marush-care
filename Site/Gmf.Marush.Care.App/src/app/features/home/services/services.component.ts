import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RouteTranslatorPipe } from '@shared/pipes/routing-translator-pipe';

@Component({
  selector: 'marush-home-services',
  imports: [RouterModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class HomeServicesComponent {
  constructor(private readonly router: Router, private readonly routeTranslatorPipe: RouteTranslatorPipe) { }

  readonly redirectToServices = async() => {
    await this.router.navigate([this.routeTranslatorPipe.transform('services')]);
  };
}

