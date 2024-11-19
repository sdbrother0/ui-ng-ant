import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from '../app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideNzIcons} from '../icons-provider';
import {en_US, provideNzI18n} from 'ng-zorro-antd/i18n';
import {DatePipe, registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {FormsModule} from '@angular/forms';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  provideHttpClient, withFetch,
  withInterceptorsFromDi
} from '@angular/common/http';
import {Menu} from "../dto/menu";
import {AuthService} from "../auth/auth.service";
import {JwtInterceptor} from "../auth/jwt.Interceptor";

registerLocaleData(en);

export function initializeApp(http: HttpClient, authService: AuthService) {
  //if (authService.isLoggedIn()) {
  //  return (): Promise<Menu[]> => firstValueFrom(http.get<Menu[]>(environment.API_URL + '/meta/menu'));
  //}
  return () => Promise<Menu>;
}

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideClientHydration(),
    provideNzIcons(),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptorsFromDi(), withFetch()
    ),
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    DatePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [HttpClient],
    },
  ]
};
