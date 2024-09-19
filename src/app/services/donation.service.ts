import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Donation, DonationAdd } from '../models/donation.model';

const baseUrl = 'http://localhost:8080/donation';

@Injectable({
  providedIn: 'root',
})
export class DonationService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Donation[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authorization token found');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Donation[]>(`${baseUrl}/getHistory`, {
      headers,
    });
  }

  addDonation(donation: DonationAdd): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authorization token found');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any[]>(`${baseUrl}/add`, donation, {
      headers,
    });
  }

  delete(id: number): Observable<Donation> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authorization token found');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<Donation>(`${baseUrl}/delete/${id}`, {
      headers,
    });
  }

  getById(id: number): Observable<Donation> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authorization token found');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Donation>(`${baseUrl}/getById/${id}`, {
      headers,
    });
  }

  getHistory(id: number): Observable<Donation[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authorization token found');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Donation[]>(`${baseUrl}/getDonorHistory/${id}`, {
      headers,
    });
  }

  validate(id: number): Observable<Donation> {
    return this.getById(id).pipe(
      switchMap((donation) => {
        donation.donationStatus = 'USED';
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.put<Donation>(`${baseUrl}/edit`, donation, {
          headers,
        });
      })
    );
  }

  edit(updatedDonation: Donation): Observable<Donation> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<Donation>(`${baseUrl}/edit`, updatedDonation, {
      headers,
    });
  }
}
