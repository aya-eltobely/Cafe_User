import { Component, OnInit, Pipe } from '@angular/core';
import { CartService } from '../../../../core/services/cart.service';
import { Cart } from '../../../../shared/Models/cart';
import { CommonModule } from '@angular/common';
import { EgyCurrencyPipe } from '../../../../shared/pipes/egy-currency.pipe';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, EgyCurrencyPipe,FormsModule,MatIconModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  cartNumber!: number;
  cartData!: Cart[];
  totalOrderWithoutShipping: number=0;
  totalOrderWithShipping: number=0;


  constructor(private cartServices: CartService,private router:Router) {
  }


  ngOnInit(): void {
    this.getCartNumber();
    this.getCartItems()
    this.onUpdatetotalOrderWithoutShipping()
  }

  getCartNumber() {
    this.cartServices.CartNumber.subscribe(res => {
      this.cartNumber = res;
    })
  }

  getCartItems() {
    if (localStorage.getItem('cart')) {
      this.cartData = JSON.parse(localStorage.getItem('cart') || '[]');
      console.log(this.cartData);
    }
  }

  updateLocalStorage(cartItem: any) {
    const storedCart = localStorage.getItem('cart');
    let cart: any[] = storedCart ? JSON.parse(storedCart) : [];
    const existingProductIndex = cart.findIndex(item => item.productId === cartItem.productId);
    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity = cartItem.quantity;
      cart[existingProductIndex].subTotal = cartItem.quantity * cartItem.productPrice;
      localStorage.setItem('cart', JSON.stringify(cart));
      this.getCartItems();
      this.onUpdatetotalOrderWithoutShipping();
    }

  }

  onDescrease(cartItem: any) {
    if (cartItem.quantity != 1) {
      cartItem.quantity--;
      this.updateLocalStorage(cartItem);
    }
  }

  onEncrease(cartItem: any) {
    if (cartItem.quantity < 10) {
      cartItem.quantity++;
      this.updateLocalStorage(cartItem);
    }
  }

  onUpdatetotalOrderWithoutShipping() {
    const storedCart = localStorage.getItem('cart');
    let cart: any[] = storedCart ? JSON.parse(storedCart) : [];
    this.totalOrderWithoutShipping=0;
    cart.forEach(e => {
      this.totalOrderWithoutShipping  += Number(e.subTotal) ;
    });
    this.totalOrderWithShipping = this.totalOrderWithoutShipping+60;
    
  }

  deleteCartItem(CartItem:Cart)
  {
    const storedCart = localStorage.getItem('cart');
    let cart: any[] = storedCart ? JSON.parse(storedCart) : [];
    const existingProductIndex = cart.findIndex(item => item.productId === CartItem.productId);

    cart.splice(existingProductIndex, 1);
    localStorage.setItem('cart', JSON.stringify(cart));

    this.getCartItems();
    this.onUpdatetotalOrderWithoutShipping();
    this.cartServices.CartNumber.next(cart.length)


  }

  isCartEmpty(): boolean {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.length === 0;
}

  onCheckout()
  {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if( cart.length != 0 ) // if cart have items
    {

      this.router.navigate(['/payment'])
    }

  }

}
