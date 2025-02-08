import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { RoutingDefinition } from 'src/app/app.routes';

@Pipe({
  name: 'translateRoute'
})
@Injectable({
    providedIn: 'root'
})
export class RouteTranslatorPipe implements PipeTransform {
  transform = (key: string) => new RoutingDefinition().translateRoute(key);
}
