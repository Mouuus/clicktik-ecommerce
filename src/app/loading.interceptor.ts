import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loaderService: NgxUiLoaderService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    if (request.headers.has('SkipInterceptor')) {
      return next.handle(request);
    }
    this.loaderService.start(); // Start the loader
    return next.handle(request).pipe(
      finalize(() => {
        //just to visualize the loader handling
        setTimeout(() => {
          this.loaderService.stop(); // Stop the loader
        }, 500);
      })
    );
  }
}
