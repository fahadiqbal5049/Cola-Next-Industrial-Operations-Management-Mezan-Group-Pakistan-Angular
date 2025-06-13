import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { DxButtonModule } from 'devextreme-angular';
import { LoaderInterceptor } from './shared/Interceptors/loader.interceptor';
import { ToastrModule } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(HttpClientModule),
    importProvidersFrom(ToastrModule.forRoot()),
    provideAnimations(), {
    provide: HTTP_INTERCEPTORS,
    useClass: LoaderInterceptor,
    multi: true
  }]
};
