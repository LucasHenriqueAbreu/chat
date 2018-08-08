import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import 'rxjs/add/operator/map';

import { environment } from './../../environments/environment';

/* importing interfaces starts */
import { UsernameAvailable } from './../interfaces/username-available';
import { AuthRequest } from './../interfaces/auth-request';
import { Auth } from './../interfaces/auth';
import { UserSessionCheck } from './../interfaces/user-session-check';
import { MessageRequest } from './../interfaces/message-request';
import { MessagesResponse } from './../interfaces/messages-response';
/* importing interfaces ends */

@Injectable()
export class ChatService {

	private BASE_URL = environment.apiUrl;
	private httpOptions = {
		headers: new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': 'my-auth-token'
		})
	};

	constructor(
		private http: HttpClient,
		public router: Router
	) { }

	getUserId(): Promise<string> {
		return new Promise((resolve, reject) => {
			try {
				resolve(localStorage.getItem('userid'));
			} catch (error) {
				reject(error);
			}
		});
	}

	removeLS(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			try {
				localStorage.removeItem('userid');
				localStorage.removeItem('username');
				resolve(true);
			} catch (error) {
				reject(error);
			}
		});
	}

	usernameAvailable(params: String): Observable<UsernameAvailable> {
		return this.http.post<UsernameAvailable>(`${this.BASE_URL}usernameAvailable`, JSON.stringify({ username: params }), this.httpOptions);
	}

	login(params: AuthRequest): Observable<Auth> {
		return this.http.post(`${this.BASE_URL}login`, JSON.stringify(params), this.httpOptions).map(
			(response: Auth) => {
				return response;
			},
			(error) => {
				throw error;
			}
		);
	}

	register(params: AuthRequest): Observable<Auth> {
		return this.http.post(`${this.BASE_URL}register`, JSON.stringify(params), this.httpOptions).map(
			(response: Auth) => {
				return response;
			},
			(error) => {
				throw error;
			}
		);
	}

	userSessionCheck(): Observable<boolean> {
		const userId = localStorage.getItem('userid');
		if (userId !== null && userId !== undefined) {
			return new Observable(observer => {
				this.http.post<UserSessionCheck>(`${this.BASE_URL}userSessionCheck`, JSON.stringify({ userId: userId }), this.httpOptions).subscribe(response => {
					if (response.error) {
						this.router.navigate(['/']);
						observer.next(false);
					}
					localStorage.setItem('username', response.username);
					observer.next(true);
				})
			});
		} else {
			this.router.navigate(['/']);
			return new Observable(observer => {
				observer.next(false);
			});
		}
	}

	getMessages(params: MessageRequest): Observable<MessagesResponse> {
		return this.http.post<MessagesResponse>(`${this.BASE_URL}getMessages`, JSON.stringify(params), this.httpOptions);
	}
}
