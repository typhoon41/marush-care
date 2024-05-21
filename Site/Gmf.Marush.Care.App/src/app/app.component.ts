import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, Inject, OnInit, PLATFORM_ID, Renderer2, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '@env';
import { GlobalLoaderService } from '@shared/services/global-loader.service';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MenuComponent } from './shared/components/navigation/menu/menu.component';
import Language from './shared/models/language.model';
import { SizeService } from './shared/services/size.service';

@Component({
  selector: 'marush-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenuComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  // eslint-disable-next-line max-params
  constructor(@Inject(DOCUMENT) private readonly document: Document,
    @Inject(PLATFORM_ID) private readonly platformId: object,
    private readonly router: Router,
    readonly loader: GlobalLoaderService,
    private readonly sizeService: SizeService,
    private readonly renderer: Renderer2) {
      this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(routingEvent => {
        loader.intercept(routingEvent.type);
      });
    }

  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  ngOnInit() {
    if (environment.name === 'Production') {
      this.setupGoogleAnalytics();
    }

    if (isPlatformBrowser(this.platformId)) {
      new Language().setup();
      this.sizeService.startTrackingResizeOf(document);
    }
  }

  private readonly setupGoogleAnalytics = () => {
    this.renderer.appendChild(this.document.body, this.setupScriptTag());
    this.renderer.appendChild(this.document.body, this.setupInvokationScript());
  };

  private readonly setupScriptTag = () => {
    const result = this.renderer.createElement('script') as HTMLScriptElement;
    result.type = 'text/javascript';
    // eslint-disable-next-line no-secrets/no-secrets
    result.src = 'https://www.googletagmanager.com/gtag/js?id=G-J6MR61F0NH';
    result.async = true;
    return result;
  };

  private readonly setupInvokationScript = () => {
    const result = this.renderer.createElement('script') as HTMLScriptElement;
    result.innerHTML = `window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', 'G-J6MR61F0NH');`;
    return result;
  };
}
