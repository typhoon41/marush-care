import { CommonModule } from '@angular/common';
import { Component, DestroyRef, Renderer2, afterNextRender, inject } from '@angular/core';
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
  imports: [CommonModule, RouterOutlet, MenuComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly router: Router,
    readonly loader: GlobalLoaderService,
    private readonly sizeService: SizeService,
    private readonly renderer: Renderer2) {
      this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(routingEvent => {
        loader.intercept(routingEvent.type);
      });

      afterNextRender(() => {
        if (environment.name === 'Production') {
          this.setupGoogleAnalytics();
        }

        new Language().setup();
        this.sizeService.startTrackingResizeOf(document);
      });
    }

  private readonly setupGoogleAnalytics = () => {
    this.renderer.appendChild(document.body, this.setupScriptTag());
    this.renderer.appendChild(document.body, this.setupInvocationScript());
  };

  private readonly setupScriptTag = () => {
    const result = this.renderer.createElement('script') as HTMLScriptElement;
    result.type = 'text/javascript';
    // eslint-disable-next-line no-secrets/no-secrets
    result.src = 'https://www.googletagmanager.com/gtag/js?id=G-J6MR61F0NH';
    result.async = true;
    return result;
  };

  private readonly setupInvocationScript = () => {
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
