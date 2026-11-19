import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Renderer2, afterNextRender, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '@env';
import { Footer } from '@shared/components/footer/footer';
import { Menu } from '@shared/components/navigation/menu/menu';
import { setupGoogleAnalytics } from '@shared/models/google/tag-manager';
import Language from '@shared/models/language';
import { GlobalLoader } from '@shared/services/global-loader';
import { ScreenSize } from '@shared/services/screen-size';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-root',
  imports: [CommonModule, RouterOutlet, Menu, Footer],
  templateUrl: './application.html',
  styleUrl: './application.scss'
})
export class Application {
  protected readonly loader = inject(GlobalLoader);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly screenSize = inject(ScreenSize);
  private readonly renderer = inject(Renderer2);

  constructor() {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(routingEvent => {
        this.loader.intercept(routingEvent.type);
      });

    afterNextRender(() => {
      if (environment.name === 'Production') {
        setupGoogleAnalytics(this.renderer);
      }

      new Language().setup();
      this.screenSize.startTrackingResizeOf(document);
    });
  }
}
