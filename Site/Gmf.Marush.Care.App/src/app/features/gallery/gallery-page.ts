import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, HostBinding, linkedSignal, signal, viewChild } from '@angular/core';
import { Dialog } from '@shared/components/dialog/dialog';
import { ImageLoader } from '@shared/components/images/loader';
import { BasePage } from '@shared/components/page/base/base-page';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';
import { Stapler } from '@shared/services/metadata/stapler';
import { GalleryImage, GalleryImageDefinition } from './image';
import { GalleryPageMetadata } from './page-metadata';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-gallery-page',
  imports: [ImageLoader, Dialog],
  templateUrl: './gallery-page.html',
  styleUrl: './gallery-page.scss'
})
export class GalleryPage extends BasePage {
  @HostBinding('class') classAttribute: string = 'gallery';
  readonly detailsDialog = viewChild<Dialog>(Dialog);
  private readonly imagesRequest = httpResource<{ images: GalleryImageDefinition[] }>(() => ({
    url: GalleryImage.filePath,
    method: 'GET'
  }));

  protected readonly allImages = linkedSignal<GalleryImage[]>(() => {
    if (this.imagesRequest.hasValue()) {
      return this.imagesRequest.value().images.map(image => new GalleryImage(image.name, image.orientation));
    }

    return [];
  });

  protected readonly fetchedImages = signal<GalleryImage[]>([]);
  protected readonly selectedImage = linkedSignal<GalleryImage | undefined>(() => this.fetchedImages()[0]);

  constructor(protected override readonly metadataService: Stapler) {
    super(metadataService, new GalleryPageMetadata());
    const effectReference = effect(() => {
      if (this.allImages().length) {
        this.loadMoreImages();
        effectReference.destroy();
      }
    }, { manualCleanup: true });
  }

  protected readonly loadMoreImages = () => {
    const pageSize = 9;
    const fetchedCount = this.fetchedImages().length + pageSize;
    this.fetchedImages.set(this.allImages().slice(0, fetchedCount));
  };

  protected readonly openFullImage = (imageIndex: number, event?: OptionalKeyboardEvent) => {
    if (isAction(event)) {
      event?.preventDefault();
      this.setSelectedImageFrom(imageIndex);
      this.detailsDialog()?.open();
    }
  };

  protected readonly next = () => {
    let newIndex = this.findImageIndex() + 1;
    if (newIndex >= this.fetchedImages().length) {
      newIndex = 0;
    }

    this.setSelectedImageFrom(newIndex);
  };

  protected readonly previous = () => {
    let newIndex = this.findImageIndex() - 1;
    if (newIndex < 0) {
      newIndex = this.fetchedImages().length - 1;
    }

    this.setSelectedImageFrom(newIndex);
  };

  private readonly findImageIndex = () => {
    const selectedImageIndex = this.fetchedImages().findIndex(image => image === this.selectedImage());
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    return selectedImageIndex === -1 ? 0 : selectedImageIndex;
  };

  private readonly setSelectedImageFrom = (index: number) => {
    this.selectedImage.set(this.fetchedImages()[index]);
  };
}
