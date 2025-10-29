import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const API_BASE = 'https://68ea9e1376b3362414cbc496.mockapi.io/api/v1/users';

@Injectable({
  providedIn: 'root'
})
export class User {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(API_BASE);
  }

  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${API_BASE}/${id}`);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put(`${API_BASE}/${user.id}`, user);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${API_BASE}/${userId}`);
  }
  getRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${API_BASE}/roles`);
  }
}
