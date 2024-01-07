/* eslint-disable @stylistic/max-len */
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-home-discounts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discounts.component.html',
  styleUrl: './discounts.component.scss'
})
export class HomeDiscountsComponent implements OnInit, OnDestroy {
  readonly currentDiscounts = [
    // eslint-disable-next-line no-secrets/no-secrets
    '<p><strong>10.1 - 20.1</strong></p><p>Mikro dermoabr. + neinv. mezoter. + alginatna maska <s>7000</s> 5000</p>',
    '<p><strong>10.1 - 20.1</strong></p><p>Hemijski piling + neinv. mezoter. <s>6500</s> 5500</p>',
    '<p><strong>10.1 - 20.1</strong></p><p>Ultrazv. špatula + mikro dermoabr. + neinv. mezoter. <s>8500</s> 6000</p>'
  ];

  currentDiscountPosition = 0;
  private subscription: Subscription | undefined;

  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const defaultRefreshTime = 10000;
      this.subscription = interval(defaultRefreshTime).subscribe(_ => this.shift(1));
    }
  }

  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

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


