import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { RouteTranslator } from '@shared/pipes/routing-translator';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-home-hero',
  imports: [RouterModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class HomeHero {
  private readonly router = inject(Router);
  private readonly routeTranslator = inject(RouteTranslator);

  protected readonly redirectToAppointments = async() => {
    await this.router.navigate([this.routeTranslator.transform('appointment')]);
  };
}
