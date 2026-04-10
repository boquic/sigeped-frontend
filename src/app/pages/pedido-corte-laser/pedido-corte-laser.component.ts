import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { normalizeApiError } from '../../core/utils/api-error.util';
import { getTokenLinkErrorMessage } from '../../core/utils/token-link-error.util';
import { PublicFlowService } from '../../core/services/public-flow.service';

interface SelectedUploadFile {
  name: string;
  file: File;
}

type LaserOrderForm = FormGroup<{
  customerName: FormControl<string>;
  material: FormControl<string>;
  espesor: FormControl<string>;
  dimensiones: FormControl<string>;
  cantidad: FormControl<number | null>;
  comentarios: FormControl<string>;
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
  private readonly publicFlowService = inject(PublicFlowService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly allowedExtensions = ['dwg', 'dxf', 'pdf'];

  token = '';
  serviceName = '';
  customerDni = '';

  isContextLoading = false;
  isSubmitting = false;

  contextErrorMessage = '';
  submitErrorMessage = '';
  successMessage = '';

  selectedFiles: SelectedUploadFile[] = [];

  readonly form: LaserOrderForm = new FormGroup({
    customerName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(2)] }),
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

    this.selectedFiles = files.map((file) => ({ name: file.name, file }));
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

    if (!this.token) {
      this.contextErrorMessage = 'Token faltante. Verifica el enlace enviado por WhatsApp.';
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
    const formData = new FormData();
    formData.append('token', this.token);
    formData.append('customerName', formValue.customerName.trim());
    formData.append(
      'specifications',
      JSON.stringify({
        material: formValue.material.trim(),
        espesor: formValue.espesor.trim(),
        dimensiones: formValue.dimensiones.trim(),
        cantidad: formValue.cantidad ?? 1,
        comentarios: formValue.comentarios.trim()
      })
    );

    this.selectedFiles.forEach((selectedFile) => {
      formData.append('files', selectedFile.file, selectedFile.name);
    });

    this.isSubmitting = true;
    this.publicFlowService
      .uploadFiles(formData)
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
    this.selectedFiles = [];
    this.serviceName = '';
    this.customerDni = '';

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

    this.publicFlowService
      .getFormContext(token)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (context) => {
          this.isContextLoading = false;
          this.serviceName = context.serviceName;
          this.customerDni = context.customerDni;
          if (context.customerName?.trim()) {
            this.form.patchValue({ customerName: context.customerName.trim() });
          }
        },
        error: (error: unknown) => {
          this.isContextLoading = false;
          this.contextErrorMessage = this.resolveErrorMessage(error);
        }
      });
  }

  private handleSubmitError(error: unknown): void {
    const tokenError = getTokenLinkErrorMessage(error);
    if (tokenError) {
      this.contextErrorMessage = tokenError;
      this.submitErrorMessage = '';
      return;
    }

    this.submitErrorMessage = normalizeApiError(error).message;
  }

  private resolveErrorMessage(error: unknown): string {
    const tokenError = getTokenLinkErrorMessage(error);
    if (tokenError) {
      return tokenError;
    }

    return normalizeApiError(error).message;
  }

  private hasAllowedExtension(fileName: string): boolean {
    const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
    return this.allowedExtensions.includes(extension);
  }
}
