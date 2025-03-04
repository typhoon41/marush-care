/* eslint-disable @stylistic/max-len */
import { IStructuredData, PageMetadata } from '@shared/components/page/base/page-metadata.model';
import { ILanguage } from '@shared/models/language.model';
import { GalleryMetadata } from './models/gallery.model';

export class GalleryPageMetadata extends PageMetadata {
    override pathTranslations = () => ({ en: 'gallery', sr: 'galerija', ru: 'галерея' });
    override getTitle = () => $localize`:@@routes.gallery.title:Marush: Space of Care - galerija` as string;
    override getKeywords = () => $localize`:@@routes.gallery.keywords:kozmetički salon,kozmeticki salon,salon lepote,nega lica,obrve,trepavice,kombinacije tretmana,galerija,slike,pre i posle tretmana,Beograd,Višegradska` as string;
    override getDescription = () => $localize`:@@routes.gallery.description:Prepustite se zadivljujućoj galeriji i sveobuhvatnom pregledu koji prikazuje sve što Salon lepote Marush nudi za Vas.` as string;

    override getSpecificStructuredData = (baseStructuredData: IStructuredData, _language: ILanguage) => {
        const imageGallery = {
            '@type': 'ImageGallery',
            name: $localize`:@@gallery.metadata.title:Foto galerija salona`,
            image: [
                this.imageFrom('16.jpg', $localize`:@@gallery.metadata.image1:Priprema kože za tretman lica`),
                this.imageFrom('18.jpg', $localize`:@@gallery.metadata.image2:Nanošenje hemijskog pilinga`),
                this.imageFrom('31.jpg', $localize`:@@gallery.metadata.image3:Uživanje dok stoji maska`),
                this.imageFrom('25.jpg', $localize`:@@gallery.metadata.image4:Masaža lica`),
                this.imageFrom('27.jpg', $localize`:@@gallery.metadata.image5:Nanošenje maske`),
                this.imageFrom('4.jpg', $localize`:@@gallery.metadata.image6:Pre i posle lečenja ožiljaka od akni (period od 6 meseci)`),
                this.imageFrom('10.jpg', $localize`:@@gallery.metadata.image7:Pre i posle higijenskog tretmana`),
                this.imageFrom('11.jpg', $localize`:@@gallery.metadata.image8:Pre i posle Purple Peel 4 tretmana`)
            ]
        };

        this.getGraphFrom(baseStructuredData).push(imageGallery);
        return baseStructuredData;
    };

    private readonly imageFrom = (imageName: string, description: string) => ({
            '@type': 'ImageObject',
            contentUrl: GalleryMetadata.imageLocation(imageName),
            thumbnailUrl: GalleryMetadata.previewsLocation(imageName),
            name: description
        });
}
