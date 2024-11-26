import {ApplicationConfig, importProvidersFrom, inject, provideAppInitializer} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from '../app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideNzIcons} from '../icons-provider';
import {en_US, provideNzI18n} from 'ng-zorro-antd/i18n';
import {DatePipe, registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {FormsModule} from '@angular/forms';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi} from '@angular/common/http';
import {JwtInterceptor} from "../auth/jwt.Interceptor";
import {AppLoaderService} from "../service/app.loader.service";

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideClientHydration(), provideNzIcons(), provideNzI18n(en_US), importProvidersFrom(FormsModule), provideAnimationsAsync(), provideHttpClient(withInterceptorsFromDi(), withFetch()), {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true
  }, DatePipe, provideAppInitializer(() => inject(AppLoaderService).init()),]
};
