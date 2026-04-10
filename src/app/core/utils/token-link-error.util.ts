import { HttpErrorResponse } from '@angular/common/http';

export const INVALID_LINK_MESSAGE = 'Enlace inválido. Solicita uno nuevo por WhatsApp.';
export const EXPIRED_LINK_MESSAGE = 'Tu enlace expiró. Solicita un nuevo enlace por WhatsApp.';

export function getTokenLinkErrorMessage(error: unknown): string | null {
  if (!(error instanceof HttpErrorResponse)) {
    return null;
  }

  if (error.status === 410) {
    return EXPIRED_LINK_MESSAGE;
  }

  if (error.status === 404) {
    return INVALID_LINK_MESSAGE;
  }

  return null;
}
