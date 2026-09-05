import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PLATFORM_CONFIG } from '@ng-microfrontend/util-config';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);
  private readonly config = inject(PLATFORM_CONFIG);

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.config.apiBaseUrl}${path}`);
  }

  post<TBody, TResult>(path: string, body: TBody): Observable<TResult> {
    return this.http.post<TResult>(`${this.config.apiBaseUrl}${path}`, body);
  }
}
