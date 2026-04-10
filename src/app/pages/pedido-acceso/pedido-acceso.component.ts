import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { normalizeApiError } from '../../core/utils/api-error.util';
import { getTokenLinkErrorMessage } from '../../core/utils/token-link-error.util';
import { PublicFlowService } from '../../core/services/public-flow.service';

type RegistrationForm = FormGroup<{
  name: FormControl<string>;
}>;

@Component({
  selector: 'app-pedido-acceso',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pedido-acceso.component.html',
  styleUrls: ['./pedido-acceso.component.css']
})
export class PedidoAccesoComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly publicFlowService = inject(PublicFlowService);
  private readonly destroyRef = inject(DestroyRef);

  token = '';
  customerDni = '';
  customerName = '';
  isRegistered = false;

  isLoadingContext = false;
  isSubmittingRegister = false;
  isSubmittingAuth = false;

  errorMessage = '';

  readonly registrationForm: RegistrationForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] })
  });

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const token = params.get('token')?.trim() ?? '';
      this.loadByToken(token);
    });
  }

  get showRegister(): boolean {
    return !this.isLoadingContext && !this.errorMessage && !this.isRegistered;
  }

  get showAuthenticate(): boolean {
    return !this.isLoadingContext && !this.errorMessage && this.isRegistered;
  }

  submitRegister(event: Event): void {
    event.preventDefault();
    this.errorMessage = '';

    if (!this.registrationForm.valid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    if (!this.token) {
      this.errorMessage = 'Token faltante. Verifica el enlace enviado por WhatsApp.';
      return;
    }

    const name = this.registrationForm.controls.name.value.trim();
    this.isSubmittingRegister = true;

    this.publicFlowService
      .registerCustomer(this.token, name)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isSubmittingRegister = false;
          this.navigateToNextUrl(response.nextUrl);
        },
        error: (error: unknown) => {
          this.isSubmittingRegister = false;
          this.errorMessage = this.resolveErrorMessage(error);
        }
      });
  }

  submitAuthenticate(event: Event): void {
    event.preventDefault();
    this.errorMessage = '';

    if (!this.token) {
      this.errorMessage = 'Token faltante. Verifica el enlace enviado por WhatsApp.';
      return;
    }

    this.isSubmittingAuth = true;
    this.publicFlowService
      .authenticateCustomer(this.token)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isSubmittingAuth = false;
          this.navigateToNextUrl(response.nextUrl);
        },
        error: (error: unknown) => {
          this.isSubmittingAuth = false;
          this.errorMessage = this.resolveErrorMessage(error);
        }
      });
  }

  private loadByToken(token: string): void {
    this.token = token;
    this.errorMessage = '';
    this.isLoadingContext = false;
    this.isSubmittingAuth = false;
    this.isSubmittingRegister = false;
    this.customerDni = '';
    this.customerName = '';
    this.isRegistered = false;
    this.registrationForm.reset({ name: '' });

    if (!token) {
      this.errorMessage = 'Token faltante. Verifica el enlace enviado por WhatsApp.';
      return;
    }

    this.isLoadingContext = true;
    this.publicFlowService
      .getCustomerContext(token)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (context) => {
          this.isLoadingContext = false;
          this.customerDni = context.customerDni;
          this.customerName = context.customerName?.trim() ?? '';
          this.isRegistered = context.isRegistered;
          if (this.customerName) {
            this.registrationForm.patchValue({ name: this.customerName });
          }
        },
        error: (error: unknown) => {
          this.isLoadingContext = false;
          this.errorMessage = this.resolveErrorMessage(error);
        }
      });
  }

  private resolveErrorMessage(error: unknown): string {
    const tokenError = getTokenLinkErrorMessage(error);
    if (tokenError) {
      return tokenError;
    }

    return normalizeApiError(error).message;
  }

  private navigateToNextUrl(nextUrl: string): void {
    window.location.assign(nextUrl);
  }
}
