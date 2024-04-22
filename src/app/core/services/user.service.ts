import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../../shared/Models/order';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http:HttpClient) { }


  getProducts(subcategoryId:number,pagenumber:number,pagesize:number,search:string)
  {
    let params = new HttpParams()
    .set('subcategoryId',subcategoryId.toString())
      .set('pagenumber', pagenumber.toString())
      .set('pagesize', pagesize.toString())
      .set('search', search.toString());

    return this.http.get(`http://cafe.runasp.net/api/User/product`,{params})
  }


  getProductById(id:number)
  {
    return this.http.get(`http://cafe.runasp.net/api/User/product/${id}`)
  }


  getCategories()
  {
    return this.http.get(`http://cafe.runasp.net/api/User/Category`)
  }

  getSubCategories(categoryId:number)
  {
    return this.http.get(`http://cafe.runasp.net/api/User/subCategory/${categoryId}`)
  }


  placeOrder(order:Order):Observable<Order>
  {
    return this.http.post<Order>(`http://cafe.runasp.net/api/User/order`,order)
  }

  getAllCurrentAndCompletedOrders()
  {
    return this.http.get(`http://cafe.runasp.net/api/User/currCompOrder`)
  }

  getAllRejecteddOrders()
  {
    return this.http.get(`http://cafe.runasp.net/api/User/rejectedOrder`)
  }

  declineOrder(orderId:number)
  {
    return this.http.put(`http://cafe.runasp.net/api/User/declineOrder`,orderId)
  }



}
