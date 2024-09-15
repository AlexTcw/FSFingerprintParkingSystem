import {Injectable, NgZone} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {fromEvent, merge, Observable, switchMap, tap, timer} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private inactivityTimeout = 6000;
  private idle$: Observable<Event> = new Observable<Event>();

  baseURL = `${environment.backendURL}/util`;
  headers = new HttpHeaders({'Content-Type': 'application/json'});
  constructor(private http: HttpClient,
              private ngZone:NgZone,
              private router:Router) { }

  getFormattedCurrentDateTime(): Observable<any> {
    return this.http.get<any>(
      `${this.baseURL}/getFormattedCurrentDateTime`,
      { headers: this.headers }
    );
  }

  formatDate(date:Date):string{
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  public initialize(localitmRemove?: string): void {
    // Detectar actividad del usuario
    this.idle$ = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'keydown'),
      fromEvent(document, 'scroll')
    );

    this.ngZone.runOutsideAngular(() => {
      this.idle$
        .pipe(
          switchMap(() => timer(this.inactivityTimeout)),
          tap(() => {
            this.ngZone.run(() => {
              // Redirigir a la página de inicio
              this.router.navigateByUrl('home').then(() => null);
            });
          })
        )
        .subscribe();
    });
  }
}
