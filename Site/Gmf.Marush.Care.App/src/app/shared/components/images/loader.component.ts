import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-image-loader',
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class ImageLoaderComponent implements OnChanges {
  @Input({ required: true }) url: string = '';
  @Input() description: string = '';
  @Input() givenClass: string = '';
  @Input() selectable: boolean = false;

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
