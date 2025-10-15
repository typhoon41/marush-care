import { CommonModule } from '@angular/common';
import { afterNextRender, ChangeDetectionStrategy, Component, OnDestroy, signal } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { currentDiscounts } from '../page-metadata.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-home-discounts',
  imports: [CommonModule],
  templateUrl: './discounts.html',
  styleUrl: './discounts.scss'
})
export class HomeDiscounts implements OnDestroy {
  protected readonly currentDiscountPosition = signal(0);
  protected readonly currentDiscounts = currentDiscounts;
  private subscription: Subscription | undefined;

  constructor() {
    afterNextRender(() => {
      if (this.showSlider()) {
        this.resetSubscription();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  protected readonly showSlider = () => currentDiscounts.length > 1;

  protected readonly next = () => {
    this.shift(1);
  };

  protected readonly previous = () => {
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    this.shift(-1);
  };

  private readonly shift = (position: number) => {
    this.resetSubscription();
    const newPosition = this.currentDiscountPosition() + position;

    if (newPosition < 0) {
      this.currentDiscountPosition.set(currentDiscounts.length - 1);
      return;
    }

    if (newPosition >= currentDiscounts.length) {
      this.currentDiscountPosition.set(0);
      return;
    }

    this.currentDiscountPosition.set(newPosition);
  };

  private readonly resetSubscription = () => {
    const defaultRefreshTime = 10000;
    this.subscription?.unsubscribe();
    this.subscription = interval(defaultRefreshTime).subscribe(_ => this.next());
  };
}
