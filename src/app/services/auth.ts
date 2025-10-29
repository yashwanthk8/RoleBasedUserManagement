
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User1 {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiURL ='https://68ea9e1376b3362414cbc496.mockapi.io/api/v1/users';

  private loggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  loggedIn$ = this.loggedInSubject.asObservable();


  constructor(private http: HttpClient) {}

  signup(name: string, email: string, password: string, role: string) {
    return this.http
      .post<User1>(this.apiURL, { name, email, password, role })
      .pipe(map(() => 'success'));
  }

  login(email: string, password: string): Observable<string | null> {
    return this.http.get<User1[]>(this.apiURL).pipe(
      map((users) => {
        const user = users.find((u) => u.email === email && u.password === password);
        if (user) {
          const tokenPayload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            exp: Date.now() + 60 * 60 * 1000,
          };
          const token = btoa(JSON.stringify(tokenPayload));
          localStorage.setItem('jwtToken', token);
          this.loggedInSubject.next(true);
          console.log(token);
          return token;
        }
        return null;
      })
    );
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.loggedInSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token));
      return Date.now() < payload.exp;
    } catch {
      this.logout();
      return false;
    }
  }

  getCurrentUser() {
    const token = this.getToken();
    if (!token) return null;
    try {
      return JSON.parse(atob(token));
    } catch {
      this.logout();
      return null;
    }
  }

  getUsers(): Observable<User1[]> {
    return this.http.get<User1[]>(this.apiURL);
  }

  updateUser(userId: string, data: Partial<User1>): Observable<User1> {
    return this.http.put<User1>(`${this.apiURL}/${userId}`, data);
  }

  deleteUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiURL}/${userId}`);
  }
  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }
  getUserById(userId: string): Observable<User1> {
    return this.http.get<User1>(`${this.apiURL}/${userId}`);
  }
}

//<User> is the response type
//and the code inside this brackets() is the body of the post request
//Pipe: It’s used to chain operators that can transform, filter, or handle the observable’s data before you subscribe.
