import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  islogged = new BehaviorSubject(false);
 
  constructor(private http:HttpClient) { }

  login(loginuser:any):Observable<any>
  {
    return this.http.post(`http://cafe.runasp.net/api/Account/login`,loginuser);
  }

  register(registeruser:any):Observable<any>
  {
    return this.http.post(`http://cafe.runasp.net/api/Account/register`,registeruser);
  }


}
