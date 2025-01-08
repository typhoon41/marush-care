import { environment } from '@env';

export class GalleryMetadata {
    readonly allImages: GalleryImage[];

    private static readonly previewsSuffix = 'previews/';
    private readonly imageLocation = `${environment.staticContentUrl}images/gallery/`;
    private static readonly previewsLocation = `${environment.staticContentUrl}images/gallery/${this.previewsSuffix}`;
    static filePath = `${this.previewsLocation}metadata.json`;

    constructor(private readonly galleryImages: GalleryImage[]) {
        this.allImages = this.galleryImages.map(image => {
            return {
                name: image.name,
                orientation: image.orientation,
                previewPath: GalleryMetadata.previewsLocation + image.name,
                path: this.imageLocation + image.name
            };
        });
    }
}

export interface GalleryImage {
    name: string;
    path: string;
    previewPath: string;
    orientation: 'portrait' | 'landscape';
}
