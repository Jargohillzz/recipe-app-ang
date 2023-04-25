import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

type userProp = {
  email: string;
  id: string;
  _idToken: string;
  _tokenExpirationDate: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = new BehaviorSubject<User>(null);
  tokenTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          environment.API_KEY,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            resData.expiresIn
          );
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
          environment.API_KEY,
        {
          email: email,
          password: password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          this.handleAuth(
            resData.email,
            resData.localId,
            resData.idToken,
            resData.expiresIn
          );
        })
      );
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');

    if (this.tokenTimer) {
      clearTimeout(this.tokenTimer);
    }
    this.tokenTimer = null;
  }

  autoLogout(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
      this.router.navigate(['/auth']);
    }, duration);
  }

  autoLogin() {
    const userData: userProp = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const LoadedUser = new User(
      userData.email,
      userData.id,
      userData._idToken,
      new Date(userData._tokenExpirationDate)
    );
    if (LoadedUser.token) {
      this.user.next(LoadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  private handleAuth(
    email: string,
    id: string,
    token: string,
    expireIn: string
  ) {
    const expirationDate = new Date(new Date().getTime() + +expireIn * 1000);
    const userData = new User(email, id, token, expirationDate);
    this.user.next(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
    this.autoLogout(+expireIn * 1000);
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage: string = 'An Error Ocurred';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(() => errorMessage);
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'email already exists';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'email or password is incorrect';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'email or password is incorrect';
        break;
    }
    return throwError(() => errorMessage);
  }
}
