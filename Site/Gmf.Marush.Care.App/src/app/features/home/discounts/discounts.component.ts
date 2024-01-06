/* eslint-disable @stylistic/max-len */
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home-discounts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discounts.component.html',
  styleUrl: './discounts.component.scss'
})
export class HomeDiscountsComponent {
  readonly currentDiscounts = [
    // eslint-disable-next-line no-secrets/no-secrets
    '<p><strong>10.1 - 20.1</strong></p><p>Mikro dermoabr. + neinv. mezoter. + alginatna maska <s>7000</s> 5000</p>',
    '<p><strong>10.1 - 20.1</strong></p><p>Hemijski piling + neinv. mezoter. <s>6500</s> 5500</p>',
    '<p><strong>10.1 - 20.1</strong></p><p>Ultrazv. špatula + mikro dermoabr. + neinv. mezoter. <s>8500</s> 6000</p>'
  ];

  currentDiscountPosition = 0;

  readonly shift = (position: number) => {
    const newPosition = this.currentDiscountPosition + position;

    if (newPosition < 0) {
      this.currentDiscountPosition = this.currentDiscounts.length - 1;
      return;
    }

    if (newPosition >= this.currentDiscounts.length) {
      this.currentDiscountPosition = 0;
      return;
    }

    this.currentDiscountPosition = newPosition;
  };
}


