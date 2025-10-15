import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RouteTranslator } from '@shared/pipes/routing-translator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-home-services',
  imports: [RouterModule],
  templateUrl: './services.html',
  styleUrl: './services.scss'
})
export class HomeServices {
  constructor(private readonly router: Router, private readonly routeTranslatorPipe: RouteTranslator) { }

  protected readonly redirectToServices = async() => {
    await this.router.navigate([this.routeTranslatorPipe.transform('services')]);
  };
}

