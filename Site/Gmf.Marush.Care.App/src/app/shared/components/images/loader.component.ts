import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-image-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class ImageLoaderComponent implements OnChanges {
  readonly url = input.required<string>();
  readonly description = input<string>('');
  readonly givenClass = input<string>('');
  readonly selectable = input<boolean>(false);

  isLoading: boolean = true;

  ngOnChanges(changes: SimpleChanges) {
    const urlChanged = changes['url'];

    if (urlChanged) {
      this.isLoading = true;
    }
  }

  hideLoader = () => {
    this.isLoading = false;
  };
}
