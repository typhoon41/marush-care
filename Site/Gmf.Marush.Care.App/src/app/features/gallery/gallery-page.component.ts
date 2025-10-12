import { httpResource } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, HostBinding, linkedSignal, signal, viewChild } from '@angular/core';
import { DialogComponent } from '@shared/components/dialog/dialog.component';
import { ImageLoaderComponent } from '@shared/components/images/loader.component';
import { BasePageComponent } from '@shared/components/page/base/base-page.component';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';
import { PageMetadataService } from '@shared/services/metadata/page-metadata.service';
import { GalleryImage, GalleryImageDefinition } from './models/gallery.model';
import { GalleryPageMetadata } from './page-metadata.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-gallery-page',
  imports: [ImageLoaderComponent, DialogComponent],
  templateUrl: './gallery-page.component.html',
  styleUrl: './gallery-page.component.scss'
})
export class GalleryPageComponent extends BasePageComponent {
  @HostBinding('class') classAttribute: string = 'gallery';
  readonly detailsDialog = viewChild<DialogComponent>(DialogComponent);
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

  constructor(protected override readonly metadataService: PageMetadataService) {
    super(metadataService, new GalleryPageMetadata());
    const effectReference = effect(() => {
      if (this.allImages().length) {
        this.loadMoreImages();
        effectReference.destroy();
      }
    }, { manualCleanup: true });
  }

  readonly loadMoreImages = () => {
    const pageSize = 9;
    const fetchedCount = this.fetchedImages().length + pageSize;
    this.fetchedImages.set(this.allImages().slice(0, fetchedCount));
  };

  readonly openFullImage = (imageIndex: number, event?: OptionalKeyboardEvent) => {
    if (isAction(event)) {
      event?.preventDefault();
      this.setSelectedImageFrom(imageIndex);
      this.detailsDialog()?.open();
    }
  };

  readonly next = () => {
    let newIndex = this.findImageIndex() + 1;
    if (newIndex >= this.fetchedImages().length) {
      newIndex = 0;
    }

    this.setSelectedImageFrom(newIndex);
  };

  readonly previous = () => {
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
