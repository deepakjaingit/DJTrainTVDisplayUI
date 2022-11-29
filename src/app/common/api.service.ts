import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class APIHttpService implements OnDestroy {

    constructor(private http: HttpClient) {

    }

    ngOnDestroy(): void {
    }

    getData(path: string, successEmit: (result: any) => void, FailEmit: (result: any) => void) {
        const httpOptions = {
            headers: new HttpHeaders({
                'USER_DEVICE_WIDTH': window.screen.availWidth.toString()
            })
        }
        let url = '/api/request/' + path;
        if (location.port == '4200') {
            url = 'https://localhost:44328/request/' + path
        }
        const request = this.http.get(url, httpOptions)
            .pipe(take(1)).subscribe(
                {
                    next: (v) => successEmit(v as any),
                    error: (e) => FailEmit(e),
                    complete: () => { request.unsubscribe() }
                }
            );
    }
}