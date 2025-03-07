import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Renderer2, afterNextRender, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterOutlet } from '@angular/router';
import { environment } from '@env';
import { setupGoogleAnalytics } from '@shared/models/google/tag-manager';
import { GlobalLoaderService } from '@shared/services/global-loader.service';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MenuComponent } from './shared/components/navigation/menu/menu.component';
import Language from './shared/models/language.model';
import { SizeService } from './shared/services/size.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        setupGoogleAnalytics(this.renderer);
      }

      new Language().setup();
      this.sizeService.startTrackingResizeOf(document);
    });
  }
}
