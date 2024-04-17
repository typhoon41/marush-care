/* eslint-disable @stylistic/max-len */
import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
    selector: 'marush-gallery-page',
    standalone: true,
    imports: [],
    templateUrl: './gallery-page.component.html',
    styleUrl: './gallery-page.component.scss'
  })
  export class GalleryPageComponent {
    constructor(private readonly meta: Meta, private readonly title: Title) {
      this.meta.updateTag({ name: 'description', content: $localize`:@@routes.gallery.description:Prepustite se zadivljujućoj galeriji i sveobuhvatnom pregledu koji prikazuje sve što Salon lepote Marush nudi za Vas.` });
      this.meta.updateTag({ name: 'keywords', content: $localize`:@@routes.gallery.keywords:kozmetički salon,salon lepote,nega lica,obrve,trepavice,kombinacije tretmana,galerija,slike,pre i posle tretmana,Beograd,Vlajkovićeva` });
      this.title.setTitle($localize`:@@routes.gallery.title:Marush: Space of Care - galerija`);
    }

    readonly loadMoreImages = () => {
        // eslint-disable-next-line no-console
        console.log('yes');
    };
  }
