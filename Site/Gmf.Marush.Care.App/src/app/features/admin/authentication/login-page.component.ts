import { afterNextRender, ChangeDetectionStrategy, Component, HostBinding, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputComponent } from '@shared/components/forms/input/input.component';
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
  globalError = '';
  constructor(private readonly captchaService: CaptchaService,
    private readonly router: Router,
    private readonly renderer: Renderer2,
    private readonly formBuilder: NonNullableFormBuilder) {
    const userFieldLength = 64;
    const passwordFieldLength = 512;
    this.form = this.formBuilder.group({
      username: new FormControl('', [Validators.required, Validators.maxLength(userFieldLength)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(passwordFieldLength)])
    }, { updateOn: 'blur' });

    afterNextRender(() => {
      const script = this.renderer.createElement('script') as HTMLScriptElement;
      this.renderer.appendChild(document.body, this.captchaService.setup(script));
    });
  }

  readonly onSubmit = async() => {
    this.globalError = '';
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    try {
      await this.captchaService.executeProtectedAction('LOGIN', (token, action) =>
        // eslint-disable-next-line no-console
        Promise.resolve(console.log(`Captcha token: ${token}, action: ${action}`)));
      await this.router.navigate(['admin']);
    } catch {
      this.globalError = 'Korisničko ime ili lozinka nisu ispravni!';
    }
  };
}
