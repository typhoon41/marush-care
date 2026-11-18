import { afterNextRender, ChangeDetectionStrategy, Component, inject, Renderer2, signal } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Input } from '@shared/components/forms/input/input';
import { Authentication } from '@shared/services/authentication';
import { Captcha } from '@shared/services/captcha';

@Component({
  host: { class: 'row center-content vertical-stack' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-login-page',
  imports: [ReactiveFormsModule, Input],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  protected readonly form: FormGroup;
  protected readonly globalError = signal('');
  private readonly captcha = inject(Captcha);
  private readonly authentication = inject(Authentication);
  private readonly router = inject(Router);
  private readonly renderer = inject(Renderer2);
  private readonly title = inject(Title);
  private readonly formBuilder = inject(NonNullableFormBuilder);

  constructor() {
    const userFieldLength = 64;
    const passwordFieldLength = 512;
    this.title.setTitle('Marush: Space of Care - prijava');
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.maxLength(userFieldLength)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(passwordFieldLength)])
    }, { updateOn: 'change' });

    afterNextRender(() => {
      const script = this.renderer.createElement('script') as HTMLScriptElement;
      this.renderer.appendChild(document.body, this.captcha.setup(script));
    });
  }

  protected readonly onSubmit = async() => {
    this.globalError.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    try {
      await this.captcha.executeProtectedAction('LOGIN', (token, action) =>
        this.authentication.login(this.form.value, token, action));
        await this.router.navigate(['admin/klijenti']);
    } catch {
      this.globalError.set('Korisničko ime ili lozinka nisu ispravni!');
    }
  };
}
