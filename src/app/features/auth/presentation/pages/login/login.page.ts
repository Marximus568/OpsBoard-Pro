import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthFacade } from '../../../application/auth.facade';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss']
})
export class LoginPage {
    private readonly fb = inject(FormBuilder);
    private readonly authFacade = inject(AuthFacade);

    readonly loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    readonly mfaForm = this.fb.group({
        code: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    });

    readonly isLoading = this.authFacade.isLoading;
    readonly error = this.authFacade.error;
    readonly mfaRequired = this.authFacade.mfaRequired;

    async onSubmit(): Promise<void> {
        if (this.loginForm.invalid) return;
        await this.authFacade.login(this.loginForm.value);
    }

    async onMfaSubmit(): Promise<void> {
        if (this.mfaForm.invalid) return;
        await this.authFacade.verifyMfa(this.mfaForm.get('code')?.value || '');
    }
}
