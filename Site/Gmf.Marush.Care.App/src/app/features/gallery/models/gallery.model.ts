import { environment } from '@env';

export class GalleryMetadata {
    readonly allImages: GalleryImage[];

    private static readonly previewsSuffix = 'previews/';
    static readonly imageLocation = (imageName: string) => `${environment.staticContentUrl}images/gallery/${imageName}`;
    static readonly previewsLocation = (imageName: string) =>
        `${environment.staticContentUrl}images/gallery/${this.previewsSuffix}${imageName}`;

    static filePath = `${this.previewsLocation('')}metadata.json`;

    constructor(private readonly galleryImages: GalleryImage[]) {
        this.allImages = this.galleryImages.map(image => {
            return {
                name: image.name,
                orientation: image.orientation,
                previewPath: GalleryMetadata.previewsLocation(image.name),
                path: GalleryMetadata.imageLocation(image.name)
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
