import { CommonModule } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { currentDiscounts } from '../page-metadata.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-home-discounts',
  imports: [CommonModule],
  templateUrl: './discounts.component.html',
  styleUrl: './discounts.component.scss'
})
export class HomeDiscountsComponent implements OnDestroy {
  currentDiscountPosition = 0;
  currentDiscounts = currentDiscounts;

  private subscription: Subscription | undefined;

  constructor() {
    afterNextRender(() => {
      if (this.showSlider()) {
        this.resetSubscription();
      }
    });
  }

  readonly showSlider = () => currentDiscounts.length > 1;

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
      this.currentDiscountPosition = currentDiscounts.length - 1;
      return;
    }

    if (newPosition >= currentDiscounts.length) {
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
