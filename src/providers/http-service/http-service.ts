import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, finalize, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HttpServiceProvider {

	constructor(public http: HttpClient) {
		console.log('Hello HttpServiceProvider Provider');
	}

	getLocationList(searchString : string) :Observable<any> {
		
		let httpHeaders = new HttpHeaders()
			.set('Content-Type', 'application/json');
	
		let url = `getLocationDetails/maps/api/place/autocomplete/json?key=AIzaSyCMdl2byZOgAEJwJXO3LeTHwHT4JQWQ7Zo&input=${searchString}`;
		return this.http.get(url, {
			headers: httpHeaders
		});
		
		// return this.http.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyCMdl2byZOgAEJwJXO3LeTHwHT4JQWQ7Zo&input=${searchString}`,{
		// 	headers : httpHeaders
		// }).pipe(map (res => {
		// 	return res;
		// }));
	}
}
