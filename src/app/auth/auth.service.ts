import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  }

  isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    return this.hasCookie('access_token');
  }

  login(token: string) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.setCookie('access_token', token, 1);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      this.deleteCookie('access_token');
    }

    this.router.navigate(['/']);
  }

  getToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return this.getCookie('access_token');
  }

  private setCookie(name: string, value: string, days: number) {
    const expires = new Date();
    expires.setDate(expires.getDate() + days);

    document.cookie =
      `${name}=${encodeURIComponent(value)}; ` +
      `expires=${expires.toUTCString()}; ` +
      `path=/; SameSite=Lax`;
  }

  private getCookie(name: string): string | null {
    const cookies = document.cookie.split(';');

    for (const cookie of cookies) {
      const trimmed = cookie.trim();

      if (trimmed.startsWith(name + '=')) {
        return decodeURIComponent(
          trimmed.substring(name.length + 1)
        );
      }
    }

    return null;
  }

  private deleteCookie(name: string) {
    document.cookie =
      `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  private hasCookie(name: string): boolean {
    return this.getCookie(name) !== null;
  }
}
