import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'money'
})
@Injectable({
    providedIn: 'root'
})
export class MoneyPipe implements PipeTransform {
  transform = (value: number | string) => {
    if (!value) {
      return '';
    }

    return value.toString()
      .replace(/\B(?=(\d{3})+(?!\d))/gu, '.');
  };
}
