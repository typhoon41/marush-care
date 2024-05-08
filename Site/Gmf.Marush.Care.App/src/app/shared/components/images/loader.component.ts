import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'marush-image-loader',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss'
})
export class ImageLoaderComponent implements OnChanges {
    @Input() url: string = '';
    @Input() description: string = '';
    @Input() givenClass: string = '';
    @Input() selectable: boolean = false;

    isLoading: boolean = true;

    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
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
