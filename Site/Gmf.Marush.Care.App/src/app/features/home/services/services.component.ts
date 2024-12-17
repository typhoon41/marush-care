import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BaseRoutingComponent } from '@shared/components/navigation/base-routing.component';

@Component({
  selector: 'marush-home-services',
  imports: [RouterModule],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class HomeServicesComponent extends BaseRoutingComponent {
  constructor(private readonly router: Router) {
    super();
  }

  readonly redirectToServices = () => {
    this.router.navigate([this.translateRoute('services')]);
  };
}

