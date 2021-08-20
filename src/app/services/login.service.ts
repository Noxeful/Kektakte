import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../entities/user';
import { tap } from 'rxjs/operators';

const baseUrl: string = 'https://localhost:44317';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  public jsonPlease(user: User): Observable<any> {
    const body = { username: user.userName, password: user.password };
    return this.http.post(`${baseUrl}/api/AccountApi/KekPlusTen`, body);
  }

  public tryToLogIn(user: User): Observable<any> {
    const body = { username: user.userName, password: user.password };
    return this.http.post(`${baseUrl}/api/AccountApi/Login`, body);
  }

  public giveMeTheWall(int: number): Observable<any> {
    // const body = { id: int};
    const id: number = int;
    return this.http.post(`${baseUrl}/api/WallApi/GetAllWallPostsById`, id);
  }


}
