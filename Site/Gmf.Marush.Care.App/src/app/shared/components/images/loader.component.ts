import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, linkedSignal } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-image-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class ImageLoaderComponent {
  readonly url = input.required<string>();
  readonly description = input<string>('');
  readonly givenClass = input<string>('');
  readonly selectable = input<boolean>(false);

  readonly isLoading = linkedSignal({
    source: this.url,
    computation: (newValue, previous) => previous?.value !== newValue
  });

  hideLoader = () => {
    this.isLoading.set(false);
  };
}
