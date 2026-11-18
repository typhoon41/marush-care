import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
  private readonly router = inject(Router);
  private readonly routeTranslator = inject(RouteTranslator);

  protected readonly redirectToServices = async() => {
    await this.router.navigate([this.routeTranslator.transform('services')]);
  };
}

