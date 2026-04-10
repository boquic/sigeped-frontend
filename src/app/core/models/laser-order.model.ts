export interface CustomerContextResponse {
  success: true;
  data: CustomerContextData;
}

export interface CustomerContextData {
  customerDni: string;
  customerName: string | null;
  isRegistered: boolean;
}

export interface CustomerRegisterRequest {
  token: string;
  name: string;
}

export interface CustomerRegisterResponse {
  success: true;
  nextUrl: string;
}

export interface CustomerAuthenticateRequest {
  token: string;
}

export interface CustomerAuthenticateResponse {
  success: true;
  nextUrl: string;
}

export interface FormContextResponse {
  success: true;
  data: FormContextData;
}

export interface FormContextData {
  serviceType: string;
  serviceName: string;
  customerDni: string;
  customerName: string | null;
}

export interface LaserOrderSpecifications {
  material: string;
  espesor: string;
  dimensiones: string;
  cantidad: number;
  comentarios: string;
}

export interface UploadFilesResponse {
  success: true;
  orderId: number;
  message: string;
}