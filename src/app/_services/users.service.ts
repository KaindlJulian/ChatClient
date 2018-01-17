import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const SERVER_URL = 'http://localhost:8080';

@Injectable()
export class AuthenticationService {
    public token: string;

    constructor(private http: Http) {
        // set token if saved in local storage
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.token;
    }

    register(name: string, email: string, username: string, password: string): Observable<boolean> {
        return this.http.post(SERVER_URL + '/users/register', JSON.stringify({ name: name, email: email, username: username, password: password }))
            .map((response: Response) => {
                if (response.json().success) {
                    return true;
                } else {
                    return false;
                }
            });
    }

    login(username: string, password: string): Observable<boolean> {
        return this.http.post(SERVER_URL + '/users/authenticate', JSON.stringify({ username: username, password: password }))
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                const token = response.json() && response.json().token;
                if (token) {
                    this.token = token;

                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));

                    return true;    // succesfull login
                } else {
                    return false;   // login failed
                }
            });
    }

    logout(): void {
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}