import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, Role, Authority, UserAdd } from '../models/user.model';

const baseUrl = 'http://localhost:8080/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  findAll(): Observable<User[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authorization token was found');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<User[]>(`${baseUrl}/findAll`, {
      headers,
    });
  }

  findByCin(cin: string): Observable<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authorization token was found');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<User>(`${baseUrl}/findByCin/${cin}`, {
      headers,
    });
  }

  delete(id: number): Observable<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authorization token was found');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(`${baseUrl}/delete/${id}`, {
      headers,
    });
  }

  addUser(user: UserAdd): Observable<User> {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No authorization token was found');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<User>(`${baseUrl}/add`, user, {
      headers,
    });
  }
}
