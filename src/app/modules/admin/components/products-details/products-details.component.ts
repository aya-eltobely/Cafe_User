import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { EgyCurrencyPipe } from '../../../../shared/pipes/egy-currency.pipe';
import { Product } from '../../../../shared/Models/product';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../../core/services/user.service';
import { Cart } from '../../../../shared/Models/cart';
import { CartService } from '../../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-products-details',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, EgyCurrencyPipe, MatChipsModule, FormsModule,NgIf],
  templateUrl: './products-details.component.html',
  styleUrl: './products-details.component.scss'
})
export class ProductsDetailsComponent implements OnInit {

  product!: Product;
  // selectedSize!: number;
  quantity: number = 1;
  cart: Cart[] = []

  constructor(public dialogRef: MatDialogRef<ProductsDetailsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private userServices: UserService,private cartService:CartService,private toastr:ToastrService) {
  }

  ngOnInit(): void {

    this.userServices.getProductById(this.data).subscribe((res: any) => {
      this.product = res;
      console.log(res);

    })


  }


  onDescrease() {
    if (this.quantity != 1) {
      this.quantity--;
    }

  }
  onEncrease() {
    if (this.quantity < 10) {
      this.quantity++;
    }
  }



  onAddToCart() {
    const storedCart = localStorage.getItem('cart');

    let cart: any[] = storedCart ? JSON.parse(storedCart) : [];

    const existingProductIndex = cart.findIndex(item => item.productId === this.product.id);

    if (existingProductIndex !== -1) { 
      cart[existingProductIndex].quantity += this.quantity;
    } 
    else {
      cart.push({
        productId: this.product.id,
        productName: this.product.name,
        productPrice: this.product.price,
        quantity: this.quantity,
        subTotal: this.quantity * this.product.price,
        contentType: this.product.contentType,
        imageData: this.product.imageData,
        fileName:this.product.fileName     
      }) 
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartService.CartNumber.next(cartItems.length);

    this.toastr.success('Item added to cart')
    console.log(this.cartService.CartNumber.getValue());
    
  }


  onClose()
  {
    this.dialogRef.close()

  }

}
