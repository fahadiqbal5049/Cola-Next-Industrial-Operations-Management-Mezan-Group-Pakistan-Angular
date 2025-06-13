import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { finalize, Observable, throwError } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { catchError } from 'rxjs/operators';
import notify from 'devextreme/ui/notify';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {

  constructor(private loaderService: LoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Show the loader when the HTTP request starts
    this.loaderService.showLoader();

    return next.handle(req).pipe(
      // Catch any errors during the request and display a notification
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';

        // Check for client-side or network errors
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${error.error.message}`;
        } else {
          // Handle HTTP error responses
          errorMsg = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }

        // Notify the user about the error using DevExtreme's notify
        notify(errorMsg, 'error');
        // Throw the error to propagate it further
        return throwError(() => new Error(errorMsg));
      }),
      // Finally, hide the loader after the request is completed
      finalize(() => {
        this.loaderService.hideLoader();
      })
    );
  }
}
