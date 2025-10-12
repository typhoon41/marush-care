import { environment } from '@env';

export class GalleryImage implements GalleryImageDefinition {
    readonly path: string;
    readonly previewPath: string;

    private static readonly previewsSuffix = 'previews/';
    static readonly imageLocation = (imageName: string) => `${environment.staticContentUrl}images/gallery/${imageName}`;
    static readonly previewsLocation = (imageName: string) =>
        `${environment.staticContentUrl}images/gallery/${this.previewsSuffix}${imageName}`;

    static filePath = `${this.previewsLocation('')}metadata.json`;

    constructor(readonly name: string, readonly orientation: 'portrait' | 'landscape') {
        this.previewPath = GalleryImage.previewsLocation(name);
        this.path = GalleryImage.imageLocation(name);
    }
}

export interface GalleryImageDefinition {
    name: string;
    orientation: 'portrait' | 'landscape';
}
