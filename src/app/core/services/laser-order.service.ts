import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  SubmitLaserOrderRequest,
  UploadFilesResponse,
  WebFormContext,
  WebFormContextData
} from '../models/laser-order.model';
import { ApiUrlService } from './api-url.service';

@Injectable({
  providedIn: 'root'
})
export class LaserOrderService {
  constructor(
    private readonly http: HttpClient,
    private readonly apiUrl: ApiUrlService
  ) {}

  getFormContext(token: string): Observable<WebFormContextData> {
    const params = new HttpParams().set('token', token);
    return this.http.get<WebFormContext>(this.apiUrl.build('/api/web/form-context'), { params }).pipe(map((response) => response.data));
  }

  submitOrder(request: SubmitLaserOrderRequest): Observable<UploadFilesResponse> {
    const formData = new FormData();
    formData.append('token', request.token);
    formData.append('customerName', request.customerName);
    formData.append('specifications', JSON.stringify(request.specifications));

    request.files.forEach((file) => {
      formData.append('files', file, file.name);
    });

    return this.http.post<UploadFilesResponse>(this.apiUrl.build('/api/upload-files'), formData);
  }
}