import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageDTO } from '../entities/messageDTO';
import { Observable } from 'rxjs/';
import { UserData } from '../entities/userData';
import { FriendsRequests } from '../entities/friendsRequests';

const baseUrl: string = 'https://localhost:44317';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private http: HttpClient) { }

  public getUserData(tempId: number): Observable<any> {
    const body = {id: tempId };
    return this.http.post(`${baseUrl}/api/UserApi/GetMainInfo`, body);
  }

  public getAllUserDataById(idArray: number[]): Observable<any> {
    return this.http.post(`${baseUrl}/api/UserApi/GetAllUsersDataById`, idArray);
  }

  public sendUserToEdit(myUser: UserData): Observable<any> {
    const body = {id: myUser.id, name: myUser.name, lastName: myUser.lastName,
      birthDate: myUser.birthDate, city: myUser.city, language: myUser.language,
      ideology: myUser.ideology};
    return this.http.post(`${baseUrl}/api/UserApi/UpdateUserInfo`, body);
  }

  public updateStatus(statusec: string): Observable<any> {
    const body = {status: statusec};
    return this.http.post(`${baseUrl}/api/UserApi/UpdateUserStatus`, body);
  }

  public getAllInterests(pageId: number): Observable<any> {
    const body = {id: pageId};
    return this.http.post(`${baseUrl}/api/UserApi/GetAllUserInterests`, body);
  }

  public createInterest(interesec: string): Observable<any> {
    const body = {interest: interesec};
    return this.http.post(`${baseUrl}/api/UserApi/CreateInterest`, body);
  }

  public deleteInterest(interesec: string): Observable<any> {
    const body = {interest: interesec};
    return this.http.post(`${baseUrl}/api/UserApi/DeleteInterest`, body);
  }

  public getFriendsId(userId: number): Observable<any> {
    const body = {id: userId};
    return this.http.post(`${baseUrl}/api/UserApi/GetFriendsId`, body);
  }

  public getUserByName(name: string): Observable<any> {
    const body = {status: name};
    return this.http.post(`${baseUrl}/api/UserApi/GetUserByName`, body);
  }

  public deleteFriendById(userId: number): Observable<any> {
    const body = {id: userId};
    return this.http.post(`${baseUrl}/api/UserApi/DeleteFriendById`, body);
  }

  public getAllFriendsRequests(userId: number): Observable<any> {
    const body = {id: userId};
    return this.http.post(`${baseUrl}/api/UserApi/GetAllFriendsRequests`, body);
  }

  public sendFriendsRequestToHandler(friendsReq: FriendsRequests): Observable<any> {
    const body = {userId: friendsReq.userId, requestedFriendId: friendsReq.requestedFriendId, requestResponse: friendsReq.requestResponse, isResponseGiven: friendsReq.isResponseGiven};
    return this.http.post(`${baseUrl}/api/UserApi/FriendsRequestHandler`, body);
  }

  public createFriendsRequest(targetId: number): Observable<any> {
    const body = {id: targetId};
    return this.http.post(`${baseUrl}/api/UserApi/AddFriendsRequestById`, body);
  }

}
