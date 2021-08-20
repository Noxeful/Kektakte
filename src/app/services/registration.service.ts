import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../entities/user';
import { Observable } from 'rxjs';

const baseUrl: string = 'https://localhost:44317';


@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private http: HttpClient) { }

  public sendUser(user: User): Observable<any> {
    const body = { username: user.userName, password: user.password };
    return this.http.post(`${baseUrl}/api/AccountApi/KekPlusTen`, body);
  }

  public tryToRegisterUser(user: User): Observable<any> {
    const body = { username: user.userName, password: user.password };
    return this.http.post(`${baseUrl}/api/AccountApi/Registration`, body);
  }

}
