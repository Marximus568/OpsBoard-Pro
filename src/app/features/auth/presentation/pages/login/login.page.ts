import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthFacade } from '../../../application/auth.facade';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
    private readonly fb = inject(FormBuilder);
    private readonly route = inject(ActivatedRoute);
    private readonly authFacade = inject(AuthFacade);

    readonly loginForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        rememberMe: [false]
    });

    readonly mfaForm = this.fb.group({
        code: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    });

    readonly isLoading = this.authFacade.isLoading;
    readonly error = this.authFacade.error;
    readonly mfaRequired = this.authFacade.mfaRequired;

    ngOnInit(): void {
        const remembered = this.authFacade.getRememberedEmail();
        if (remembered) {
            this.loginForm.patchValue({ email: remembered, rememberMe: true });
        }
    }

    private readonly returnUrl = this.route.snapshot.queryParams['returnUrl'];

    async onSubmit(): Promise<void> {
        if (this.loginForm.invalid) return;
        await this.authFacade.login(this.loginForm.value, this.returnUrl);
    }

    async onMfaSubmit(): Promise<void> {
        if (this.mfaForm.invalid) return;
        await this.authFacade.verifyMfa(this.mfaForm.get('code')?.value || '', this.returnUrl);
    }
}
