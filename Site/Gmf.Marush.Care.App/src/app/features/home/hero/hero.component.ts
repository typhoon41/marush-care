import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BaseRoutingComponent } from '@shared/components/navigation/base-routing.component';

@Component({
    selector: 'marush-home-hero',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './hero.component.html',
    styleUrl: './hero.component.scss'
  })
  export class HomeHeroComponent extends BaseRoutingComponent {
    constructor(private readonly router: Router) {
      super();
    }

    readonly redirectToAppointments = () => {
      this.router.navigate([this.translateRoute('appointment')]);
    };
  }
