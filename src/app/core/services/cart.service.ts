import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  CartNumber = new BehaviorSubject<any>(0);

  constructor() { 

    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    this.CartNumber.next(cartItems.length);

  }

}
