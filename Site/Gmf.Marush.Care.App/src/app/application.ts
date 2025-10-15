import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Renderer2, afterNextRender, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '@env';
import { setupGoogleAnalytics } from '@shared/models/google/tag-manager';
import { GlobalLoader } from '@shared/services/global-loader';
import { Footer } from './shared/components/footer/footer';
import { Menu } from './shared/components/navigation/menu/menu';
import Language from './shared/models/language';
import { ScreenSize } from './shared/services/screen-size';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-root',
  imports: [CommonModule, RouterOutlet, Menu, Footer],
  templateUrl: './application.html',
  styleUrl: './application.scss'
})
export class Application {
  private readonly destroyRef = inject(DestroyRef);

  constructor(private readonly router: Router,
    readonly loader: GlobalLoader,
    private readonly sizeService: ScreenSize,
    private readonly renderer: Renderer2) {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(routingEvent => {
        loader.intercept(routingEvent.type);
      });

    afterNextRender(() => {
      if (environment.name === 'Production') {
        setupGoogleAnalytics(this.renderer);
      }

      new Language().setup();
      this.sizeService.startTrackingResizeOf(document);
    });
  }
}
