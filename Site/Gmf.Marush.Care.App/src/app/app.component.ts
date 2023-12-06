import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { environment } from '@env';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  @ViewChild(RouterLinkActive) rla: RouterLinkActive | undefined;

  constructor(@Inject(DOCUMENT) private readonly document: Document,
    private readonly renderer: Renderer2) { }

    logoHovered = false;
    readonly logoPath = () => this.rla?.isActive || this.logoHovered ?
      'assets/images/logo-active.png' : 'assets/images/logo.png';

  // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
  ngOnInit() {
    if (environment.name === 'Production') {
      this.setupGoogleAnalytics();
    }
  }

  title = 'marush';

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
