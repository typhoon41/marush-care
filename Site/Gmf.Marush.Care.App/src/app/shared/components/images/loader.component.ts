import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'marush-image-loader',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './loader.component.html',
    styleUrl: './loader.component.scss'
})
export class ImageLoaderComponent {
    @Input() url: string = '';
    @Input() description: string = '';
    @Input() givenClass: string = '';
    @Input() selectable: boolean = false;

    isLoading: boolean = true;

    hideLoader = () => {
      this.isLoading = false;
    };
}
