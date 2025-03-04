import { HttpClient } from '@angular/common/http';
import { afterNextRender, Component, HostBinding, OnDestroy, ViewChild } from '@angular/core';
import { DialogComponent } from '@shared/components/dialog/dialog.component';
import { ImageLoaderComponent } from '@shared/components/images/loader.component';
import { BasePageComponent } from '@shared/components/page/base/base-page.component';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';
import { PageMetadataService } from '@shared/services/metadata/page-metadata.service';
import { Subscription } from 'rxjs';
import { GalleryImage, GalleryMetadata } from './models/gallery.model';
import { GalleryPageMetadata } from './page-metadata.model';

@Component({
  selector: 'marush-gallery-page',
  imports: [ImageLoaderComponent, DialogComponent],
  templateUrl: './gallery-page.component.html',
  styleUrl: './gallery-page.component.scss'
})
export class GalleryPageComponent extends BasePageComponent implements OnDestroy {
  @HostBinding('class') classAttribute: string = 'gallery';
  @ViewChild(DialogComponent) detailsDialog!: DialogComponent;
  imageCount = 0;
  fetchedCount = 0;
  images: GalleryImage[] = [];
  fetchedImages: GalleryImage[] = [];
  selectedImage: GalleryImage | undefined;
  selectedImageIndex: number | undefined;
  private subscription: Subscription | undefined;
  private readonly pageSize = 9;

  constructor(private readonly http: HttpClient, protected override readonly metadataService: PageMetadataService) {
    super(metadataService, new GalleryPageMetadata());
    afterNextRender(() => {
      this.loadImages();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  readonly loadImages = () => {
    this.subscription = this.http.get<{ images: GalleryImage[] }>(GalleryMetadata.filePath).subscribe(data => {
      this.images = new GalleryMetadata(data.images).allImages;
      this.imageCount = data.images.length;
      this.loadMoreImages();
    });
  };

  readonly loadMoreImages = () => {
    const lastFetchCount = this.fetchedCount;
    this.fetchedCount += this.pageSize;

    if (this.fetchedCount > this.imageCount) {
      this.fetchedCount = this.imageCount;
    }

    [...Array(this.imageCount + 1).keys()]
      .filter(counter => counter <= this.fetchedCount && counter >= lastFetchCount + 1)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      .forEach(imageCounter => this.fetchedImages.push(this.images.find(image => image.name === `${imageCounter}.jpg`)!));
  };

  readonly openFullImage = (image: GalleryImage, imageIndex: number, event?: OptionalKeyboardEvent) => {
    if (isAction(event)) {
      event?.preventDefault();
      this.selectedImage = image;
      this.selectedImageIndex = imageIndex;
      this.detailsDialog.open();
    }
  };

  readonly next = () => {
    let newIndex = (this.selectedImageIndex ?? 0) + 1;
    if (newIndex >= this.fetchedCount) {
      newIndex = 0;
    }

    this.selectedImageIndex = newIndex;
    this.selectedImage = this.fetchedImages[this.selectedImageIndex];
  };

  readonly previous = () => {
    let newIndex = (this.selectedImageIndex ?? 0) - 1;
    if (newIndex < 0) {
      newIndex = this.fetchedCount - 1;
    }

    this.selectedImageIndex = newIndex;
    this.selectedImage = this.fetchedImages[this.selectedImageIndex];
  };
}
