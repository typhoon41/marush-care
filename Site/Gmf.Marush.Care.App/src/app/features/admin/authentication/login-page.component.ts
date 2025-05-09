/* eslint-disable max-params */
import { afterNextRender, ChangeDetectionStrategy, Component, HostBinding, Renderer2, signal } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '@shared/components/forms/input/input.component';
import { AuthenticationService } from '@shared/services/authentication-service';
import { CaptchaService } from '@shared/services/captcha-service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'marush-login-page',
  imports: [ReactiveFormsModule, InputComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  @HostBinding('class') classAttribute: string = 'row center-content vertical-stack';
  form: FormGroup;
  readonly globalError = signal('');
  constructor(private readonly captchaService: CaptchaService,
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly renderer: Renderer2,
    private readonly formBuilder: NonNullableFormBuilder) {
    const userFieldLength = 64;
    const passwordFieldLength = 512;
    this.form = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.maxLength(userFieldLength)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(passwordFieldLength)])
    }, { updateOn: 'change' });

    afterNextRender(() => {
      const script = this.renderer.createElement('script') as HTMLScriptElement;
      this.renderer.appendChild(document.body, this.captchaService.setup(script));
    });
  }

  readonly onSubmit = async() => {
    this.globalError.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    try {
      await this.captchaService.executeProtectedAction('LOGIN', (token, action) =>
        this.authenticationService.login(this.form.value, token, action));
        await this.router.navigate(['admin']);
    } catch {
      this.globalError.set('Korisničko ime ili lozinka nisu ispravni!');
    }
  };
}
