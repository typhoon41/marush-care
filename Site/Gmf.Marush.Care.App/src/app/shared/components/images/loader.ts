import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, linkedSignal } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-image-loader',
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.scss'
})
export class ImageLoader {
  readonly url = input.required<string>();
  readonly description = input<string>('');
  readonly givenClass = input<string>('');
  readonly selectable = input<boolean>(false);

  protected readonly isLoading = linkedSignal({
    source: this.url,
    computation: (newValue, previous) => previous?.value !== newValue
  });

  protected readonly hideLoader = () => {
    this.isLoading.set(false);
  };
}
