import {APP_INITIALIZER, ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideNzIcons} from './icons-provider';
import {en_US, provideNzI18n} from 'ng-zorro-antd/i18n';
import {DatePipe, registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {FormsModule} from '@angular/forms';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {HttpClient, provideHttpClient, withFetch} from '@angular/common/http';
import {firstValueFrom} from "rxjs";
import {environment} from "../environments/environment";
import {Menu} from "./dto/menu";

registerLocaleData(en);

export function initializeApp(http: HttpClient) {
  return (): Promise<Menu[]> => firstValueFrom(http.get<Menu[]>(environment.API_URL + '/meta/menu'));
}

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideClientHydration(),
    provideNzIcons(),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    DatePipe,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [HttpClient],
    },
  ]
};
