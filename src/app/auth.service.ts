import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {
  }

  isLoggedIn(): boolean {
    // if (typeof window === 'undefined') {
    //   return false;
    // }
    // const loggedInString = localStorage.getItem("loggedIn");
    // return JSON.parse(<string>loggedInString);
    return true;
  }

  logout() {
    console.log(localStorage);
    localStorage.setItem("loggedIn", String(false));
    this.router.navigate(['/']);
  }

  login() {
    console.log(localStorage);
    localStorage.setItem("loggedIn", String(true));
  }
}
