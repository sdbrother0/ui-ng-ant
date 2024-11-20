import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {
  }

  isLoggedIn(): boolean {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token') !== null;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

  login(token: string) {
    localStorage.setItem("token", token);
  }

  getToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    } else {
      return 'no-token';
    }
  }
}
