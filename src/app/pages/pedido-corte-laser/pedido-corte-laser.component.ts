import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LaserOrderService } from '../../core/services/laser-order.service';
import { normalizeApiError } from '../../core/utils/api-error.util';
import { ApiErrorView } from '../../core/models/api-error.model';

interface ChatMessage {
  role: 'bot' | 'user';
  text: string;
}

type LaserOrderForm = FormGroup<{
  customerName: FormControl<string>;
  material: FormControl<string>;
  espesor: FormControl<string>;
  dimensiones: FormControl<string>;
  cantidad: FormControl<number | null>;
  comentarios: FormControl<string>;
}>;

type RegistrationForm = FormGroup<{
  dni: FormControl<string>;
  nombre: FormControl<string>;
  apellido: FormControl<string>;
}>;

@Component({
  selector: 'app-pedido-corte-laser',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pedido-corte-laser.component.html',
  styleUrls: ['./pedido-corte-laser.component.css']
})
export class PedidoCorteLaserComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly laserOrderService = inject(LaserOrderService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly allowedExtensions = ['dwg', 'dxf', 'pdf'];

  token = '';
  serviceName = '';
  customerDni = '';
  customerFullName = '';
  showRegistrationForm = false;
  registrationCompleted = false;
  chatMessages: ChatMessage[] = [];

  isContextLoading = false;
  isSubmitting = false;
  isRegistering = false;

  contextErrorMessage = '';
  submitErrorMessage = '';
  successMessage = '';

  selectedFiles: File[] = [];

  readonly registrationForm: RegistrationForm = new FormGroup({
    dni: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    nombre: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    apellido: new FormControl('', { nonNullable: true, validators: [Validators.required] })
  });

  readonly form: LaserOrderForm = new FormGroup({
    customerName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    material: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    espesor: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    dimensiones: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    cantidad: new FormControl<number | null>(null, { validators: [Validators.required, Validators.min(1)] }),
    comentarios: new FormControl('', { nonNullable: true })
  });

  constructor() {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((queryParams) => {
      const token = queryParams.get('token')?.trim() ?? '';
      this.initializeForToken(token);
    });
  }

  get canSubmit(): boolean {
    return !this.isContextLoading && !this.isSubmitting && !this.contextErrorMessage && this.form.valid && this.selectedFiles.length > 0;
  }

  get isTokenReady(): boolean {
    return this.token.length > 0;
  }

  get registrationLinkLabel(): string {
    return 'Ir al registro';
  }

  get orderFormReady(): boolean {
    return this.registrationCompleted && !this.contextErrorMessage;
  }

  openRegistration(event: Event): void {
    event.preventDefault();
    this.showRegistrationForm = true;
    this.chatMessages = [
      ...this.chatMessages,
      { role: 'user', text: 'Quiero registrarme.' },
      { role: 'bot', text: 'Completa tus datos para continuar con el pedido.' }
    ];
  }

  submitRegistration(event: Event): void {
    event.preventDefault();
    this.submitErrorMessage = '';

    if (!this.registrationForm.valid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const registrationValue = this.registrationForm.getRawValue();
    this.isRegistering = true;

    const fullName = `${registrationValue.nombre.trim()} ${registrationValue.apellido.trim()}`.trim();
    this.customerDni = registrationValue.dni.trim();
    this.customerFullName = fullName;
    this.form.patchValue({ customerName: fullName });
    this.registrationCompleted = true;
    this.showRegistrationForm = false;
    this.isRegistering = false;
    this.chatMessages = [
      ...this.chatMessages,
      { role: 'user', text: `Mi DNI es ${this.customerDni} y mi nombre es ${fullName}.` },
      { role: 'bot', text: 'Registro listo. Ahora completa tu pedido.' }
    ];
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const files = Array.from(input?.files ?? []);
    this.submitErrorMessage = '';
    this.successMessage = '';

    if (!files.length) {
      this.selectedFiles = [];
      return;
    }

    const invalidFiles = files.filter((file) => !this.hasAllowedExtension(file.name));
    if (invalidFiles.length > 0) {
      this.selectedFiles = [];
      this.submitErrorMessage = 'Solo se permiten archivos DWG, DXF o PDF.';
      if (input) {
        input.value = '';
      }
      return;
    }

    this.selectedFiles = files;
  }

  removeFile(fileIndex: number): void {
    if (fileIndex < 0 || fileIndex >= this.selectedFiles.length) {
      return;
    }

    this.selectedFiles = this.selectedFiles.filter((_, index) => index !== fileIndex);
    this.submitErrorMessage = '';
    this.successMessage = '';
  }

  submit(event: Event): void {
    event.preventDefault();
    this.submitErrorMessage = '';
    this.successMessage = '';

    if (!this.isTokenReady) {
      this.contextErrorMessage = 'No se encontro un token valido en el enlace.';
      return;
    }

    if (!this.form.valid || this.selectedFiles.length === 0) {
      this.form.markAllAsTouched();
      if (this.selectedFiles.length === 0) {
        this.submitErrorMessage = 'Debes adjuntar al menos un archivo.';
      }
      return;
    }

    const formValue = this.form.getRawValue();

    this.isSubmitting = true;
    this.laserOrderService
      .submitOrder({
        token: this.token,
        customerName: formValue.customerName.trim(),
        specifications: {
          material: formValue.material.trim(),
          espesor: formValue.espesor.trim(),
          dimensiones: formValue.dimensiones.trim(),
          cantidad: formValue.cantidad ?? 1,
          comentarios: formValue.comentarios.trim()
        },
        files: this.selectedFiles
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.successMessage = `${response.message}. Numero de pedido: ${response.orderId}.`;
          this.form.reset({
            customerName: formValue.customerName,
            material: '',
            espesor: '',
            dimensiones: '',
            cantidad: null,
            comentarios: ''
          });
          this.selectedFiles = [];
        },
        error: (error: unknown) => {
          this.isSubmitting = false;
          this.handleSubmitError(error);
        }
      });
  }

  private initializeForToken(token: string): void {
    this.token = token;
    this.isContextLoading = false;
    this.contextErrorMessage = '';
    this.submitErrorMessage = '';
    this.successMessage = '';
    this.customerFullName = '';
    this.registrationCompleted = false;
    this.showRegistrationForm = false;
    this.chatMessages = [];
    this.selectedFiles = [];
    this.registrationForm.reset({
      dni: '',
      nombre: '',
      apellido: ''
    });
    this.form.reset({
      customerName: '',
      material: '',
      espesor: '',
      dimensiones: '',
      cantidad: null,
      comentarios: ''
    });

    if (!token) {
      this.contextErrorMessage = 'Token faltante. Verifica el enlace enviado por WhatsApp.';
      return;
    }

    this.loadContext(token);
  }

  private loadContext(token: string): void {
    this.isContextLoading = true;

    this.laserOrderService
      .getFormContext(token)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (context) => {
          this.isContextLoading = false;
          this.serviceName = context.serviceName;
          this.customerDni = context.customerDni;
          this.registrationForm.patchValue({ dni: context.customerDni });
          this.chatMessages = [
            {
              role: 'bot',
              text: `Hola. Soy el asistente de ${context.serviceName}. Registra tus datos para continuar con tu pedido.`
            }
          ];
          if (context.customerName?.trim()) {
            this.customerFullName = context.customerName.trim();
            this.registrationForm.patchValue({ nombre: context.customerName.trim() });
            this.form.patchValue({ customerName: context.customerName.trim() });
          }
        },
        error: (error: unknown) => {
          this.isContextLoading = false;
          const normalized = normalizeApiError(error);
          this.contextErrorMessage = this.resolveContextErrorMessage(error, normalized);
          this.chatMessages = [
            {
              role: 'bot',
              text: 'No pude validar tu enlace. Solicita uno nuevo por WhatsApp para continuar.'
            }
          ];
          if (normalized.requestId) {
            console.error(`[requestId:${normalized.requestId}] ${normalized.message}`);
          }
        }
      });
  }

  private handleSubmitError(error: unknown): void {
    const normalized = normalizeApiError(error);

    if (this.isTokenInvalidOrExpired(error, normalized)) {
      this.contextErrorMessage = 'El enlace del pedido es invalido o ya expiro. Solicita uno nuevo por WhatsApp.';
      this.submitErrorMessage = '';
    } else {
      this.submitErrorMessage = normalized.message;
    }

    if (normalized.requestId) {
      console.error(`[requestId:${normalized.requestId}] ${normalized.message}`);
    }
  }

  private resolveContextErrorMessage(error: unknown, normalized: ApiErrorView): string {
    if (this.isTokenInvalidOrExpired(error, normalized)) {
      return 'El enlace del pedido es invalido o ya expiro. Solicita uno nuevo por WhatsApp.';
    }

    return normalized.message;
  }

  private isTokenInvalidOrExpired(error: unknown, normalized: ApiErrorView): boolean {
    if (error instanceof HttpErrorResponse && [400, 401, 403, 404, 410].includes(error.status)) {
      return true;
    }

    const message = normalized.message.toLowerCase();
    return message.includes('token') && (message.includes('inval') || message.includes('expir'));
  }

  private hasAllowedExtension(fileName: string): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
    return this.allowedExtensions.includes(extension);
  }
}