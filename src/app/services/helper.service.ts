import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../entities/user';

const baseUrl: string = 'https://localhost:44317';


@Injectable({
  providedIn: 'root'
})

export class HelperService {

  constructor(private http: HttpClient) {

  }
  public GetUserName(user: User): Observable<any> {
    const body = {kek1: user.userName, kek2: user.password };
    return this.http.post(`${baseUrl}/api/HelperApi/GetUserNameById`, body);
  }

}
