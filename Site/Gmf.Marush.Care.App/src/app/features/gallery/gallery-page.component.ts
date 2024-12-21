/* eslint-disable @stylistic/max-len */
import { HttpClient } from '@angular/common/http';
import { afterNextRender, Component, HostBinding, OnDestroy, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DialogComponent } from '@shared/components/dialog/dialog.component';
import { ImageLoaderComponent } from '@shared/components/images/loader.component';
import { OptionalKeyboardEvent, isAction } from '@shared/functions/keyboard-event';
import { Subscription } from 'rxjs';
import { GalleryImage, GalleryMetadata } from './models/gallery.model';

@Component({
  selector: 'marush-gallery-page',
  imports: [ImageLoaderComponent, DialogComponent],
  templateUrl: './gallery-page.component.html',
  styleUrl: './gallery-page.component.scss'
})
export class GalleryPageComponent implements OnDestroy {
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
  readonly imageDescriptions = $localize`:@@gallery.image.description:Galerija: slike iz salona`;

  constructor(private readonly meta: Meta, private readonly title: Title, private readonly http: HttpClient) {
    this.meta.updateTag({ name: 'description', content: $localize`:@@routes.gallery.description:Prepustite se zadivljujućoj galeriji i sveobuhvatnom pregledu koji prikazuje sve što Salon lepote Marush nudi za Vas.` });
    this.meta.updateTag({ name: 'keywords', content: $localize`:@@routes.gallery.keywords:kozmetički salon,kozmeticki salon,salon lepote,nega lica,obrve,trepavice,kombinacije tretmana,galerija,slike,pre i posle tretmana,Beograd,Višegradska` });
    this.title.setTitle($localize`:@@routes.gallery.title:Marush: Space of Care - galerija`);
    afterNextRender(() => {
      this.loadImages();
    });
  }

  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
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
