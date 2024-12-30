import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiKey = '3fdaf4fd29d5914cb80e025e1e49228e';
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  fetchData:any;

  constructor(private http: HttpClient) {}

  getWeather(city: any) {
    return this.http.
    get(`${this.apiUrl}?q=${city}&appid=${this.apiKey}&units=metric`).
    pipe(catchError(this.handleError)
    )}

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 404) {
      return throwError(() => new Error('City not found.'));
    } else {
      return throwError(() => new Error('Something went wrong. Please try again later.'));
    }
  }
}
