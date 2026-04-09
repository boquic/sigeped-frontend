export interface WebFormContext {
  success: true;
  data: WebFormContextData;
}

export interface WebFormContextData {
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

export interface SubmitLaserOrderRequest {
  token: string;
  customerName: string;
  specifications: LaserOrderSpecifications;
  files: readonly File[];
}