/* eslint-disable max-params */
import { afterNextRender, ChangeDetectionStrategy, Component, HostBinding, Renderer2, signal } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Input } from '@shared/components/forms/input/input';
import { Authentication } from '@shared/services/authentication';
import { Captcha } from '@shared/services/captcha';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-login-page',
  imports: [ReactiveFormsModule, Input],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})
export class LoginPage {
  @HostBinding('class') classAttribute: string = 'row center-content vertical-stack';
  form: FormGroup;
  readonly globalError = signal('');
  constructor(private readonly captcha: Captcha,
    private readonly authentication: Authentication,
    private readonly router: Router,
    private readonly renderer: Renderer2,
    private readonly title: Title,
    private readonly formBuilder: NonNullableFormBuilder) {
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
