// src/app/services/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  

  constructor(private http: HttpClient) {}

  getDataBooking(): Observable<any> {
    return this.http.get('https://lightslategrey-fish-417601.hostingersite.com/api/index.php/getBookingDetails');
  }
  getDataBookingById(id:any): Observable<any> {
    return this.http.get('https://lightslategrey-fish-417601.hostingersite.com/api/index.php/getBookingDetailsById/'+id);
  }

  saveBookingData(payload: any): Observable<any> {
    return this.http.post('https://lightslategrey-fish-417601.hostingersite.com/api/index.php/saveBookingDetails', payload);
  }

  
  getDashboardDetails(payload: any): Observable<any> {
    return this.http.post('https://lightslategrey-fish-417601.hostingersite.com/api/index.php/getDashboardDetails', payload);
  }

  
}
