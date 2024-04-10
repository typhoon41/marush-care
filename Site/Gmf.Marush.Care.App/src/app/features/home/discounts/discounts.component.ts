import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'marush-home-discounts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './discounts.component.html',
  styleUrl: './discounts.component.scss'
})
export class HomeDiscountsComponent implements OnInit, OnDestroy {
  readonly currentDiscounts = [
    // eslint-disable-next-line @stylistic/max-len
    $localize`:@@discounts.1:<p><strong>8.4. - 30.4.</strong></p><p>Higij. tretman pola leđa<br/><s>4500</s> 4000</p>`,
    $localize`:@@discounts.2:<p><strong>8.4. - 30.4.</strong></p><p>Higij. tretman cela leđa<br/><s>6000</s> 5000</p>`,
    $localize`:@@discounts.3:<p><strong>8.4. - 30.4.</strong></p><p>Anti celulit masaža<br/><s>3000</s> 2500</p>`,
    $localize`:@@discounts.4:<p><strong>8.4. - 30.4.</strong></p><p>Vacuslim 48<br/><s>2500</s> 2000</p>`
  ];

  currentDiscountPosition = 0;
  private subscription: Subscription | undefined;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) { }

  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId) && this.showSlider) {
      this.resetSubscription();
    }
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
