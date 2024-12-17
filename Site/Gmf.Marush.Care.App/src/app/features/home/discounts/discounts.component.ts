import { CommonModule } from '@angular/common';
import { afterNextRender, Component, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'marush-home-discounts',
  imports: [CommonModule],
  templateUrl: './discounts.component.html',
  styleUrl: './discounts.component.scss'
})
export class HomeDiscountsComponent implements OnDestroy {
  readonly currentDiscounts = [
    $localize`:@@discounts.1:<p><strong>4.12. - 21.12.</strong></p><p>Give away!<br/>1 + 1 tretman</p>`,
    $localize`:@@discounts.2:<p><strong>2.12. - 28.12.</strong></p><p>20 + 25% za Vas i dragu osobu</p>`
  ];

  currentDiscountPosition = 0;
  private subscription: Subscription | undefined;

  constructor() {
    afterNextRender(() => {
      if (this.showSlider) {
        this.resetSubscription();
      }
    });
  }

  get showSlider() {
    return this.currentDiscounts.length > 1;
  }

  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  readonly next = () => {
    this.shift(1);
  };

  readonly previous = () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    this.shift(-1);
  };

  private readonly shift = (position: number) => {
    this.resetSubscription();
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

  private readonly resetSubscription = () => {
    const defaultRefreshTime = 10000;
    this.subscription?.unsubscribe();
    this.subscription = interval(defaultRefreshTime).subscribe(_ => this.next());
  };
}
