import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class AuthInterceptor implements HttpInterceptor {

    private accessToken: string;

    constructor() {}

    public intercept<T>(request: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
        let authRequest: HttpRequest<T> = request;
        this.accessToken = localStorage.getItem('authToken');
        let headers: {[key: string]: string } = {};

        if (this.accessToken) {
            headers['auth_token'] = this.accessToken;
        }

        authRequest = request.clone({ setHeaders: headers });
        return next.handle(authRequest);
    }
}
