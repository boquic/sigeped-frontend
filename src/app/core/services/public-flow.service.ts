import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  CustomerAuthenticateRequest,
  CustomerAuthenticateResponse,
  CustomerContextData,
  CustomerContextResponse,
  CustomerRegisterRequest,
  CustomerRegisterResponse,
  FormContextData,
  FormContextResponse,
  UploadFilesResponse
} from '../models/laser-order.model';
import { ApiUrlService } from './api-url.service';

@Injectable({
  providedIn: 'root'
})
export class PublicFlowService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiUrl: ApiUrlService
  ) {}

  getCustomerContext(token: string): Observable<CustomerContextData> {
    const params = new HttpParams().set('token', token);
    return this.http
      .get<CustomerContextResponse>(this.apiUrl.build('/api/web/customer-context'), { params })
      .pipe(map((response) => response.data));
  }

  registerCustomer(token: string, name: string): Observable<CustomerRegisterResponse> {
    const payload: CustomerRegisterRequest = { token, name };
    return this.http.post<CustomerRegisterResponse>(this.apiUrl.build('/api/web/customer-register'), payload);
  }

  authenticateCustomer(token: string): Observable<CustomerAuthenticateResponse> {
    const payload: CustomerAuthenticateRequest = { token };
    return this.http.post<CustomerAuthenticateResponse>(this.apiUrl.build('/api/web/customer-authenticate'), payload);
  }

  getFormContext(token: string): Observable<FormContextData> {
    const params = new HttpParams().set('token', token);
    return this.http
      .get<FormContextResponse>(this.apiUrl.build('/api/web/form-context'), { params })
      .pipe(map((response) => response.data));
  }

  uploadFiles(formData: FormData): Observable<UploadFilesResponse> {
    return this.http.post<UploadFilesResponse>(this.apiUrl.build('/api/upload-files'), formData);
  }
}
