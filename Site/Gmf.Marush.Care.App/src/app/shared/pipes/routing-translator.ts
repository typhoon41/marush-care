import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { RoutingDefinition } from '@shared/routes/routes';

@Pipe({
  name: 'translateRoute'
})
@Injectable({
    providedIn: 'root'
})
export class RouteTranslator implements PipeTransform {
  transform = (key: string) => new RoutingDefinition().translateRoute(key);
}
