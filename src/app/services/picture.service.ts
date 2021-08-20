import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../entities/user';
import { Observable } from 'rxjs';

const baseUrl: string = 'https://localhost:44317';

@Injectable({
  providedIn: 'root'
})
export class PictureService {

  constructor(private http: HttpClient) { }

  public tryToCreateAvatar(base64: string): Observable<any> {
    const body = { avatar: base64 };
    return this.http.post(`${baseUrl}/api/PictureApi/CreateAvatar`, body);
  }

  public getAvatar(avatarId: number): Observable<any> {
    const body = {id: avatarId};
    return this.http.post(`${baseUrl}/api/PictureApi/GetAvatar`, body);
  }

  public getAvatarCollection(avatarIds: number[]): Observable<any> {
    return this.http.post(`${baseUrl}/api/PictureApi/GetAvatarCollection`, avatarIds);
  }

}
