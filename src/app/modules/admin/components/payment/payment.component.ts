import { Component, OnInit } from '@angular/core';
import { Cart } from '../../../../shared/Models/cart';
import { CartService } from '../../../../core/services/cart.service';
import { Comment } from '@angular/compiler';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { states } from '../../../../shared/Models/states';
import { cities } from '../../../../shared/Models/cities';
import { UserService } from '../../../../core/services/user.service';
import { Order } from '../../../../shared/Models/order';
import { OrderItems } from '../../../../shared/Models/orderItems';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, AsyncPipe,],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {

  cartData!: Cart[];
  cartNumber!: number;
  totalOrder: number = 0;
  formOrder!: FormGroup;
  ////
  statesControl = new FormControl('',Validators.required);
  satesOptions!: string[]
  satesFilteredOptions!: Observable<string[]>;
  //
  citiesControl = new FormControl('',Validators.required);
  citiesOptions: string[] = [];
  citiesFilteredOptions!: Observable<string[]>;

  ////
  constructor(private cartServices: CartService, private FB: FormBuilder,private userServices:UserService,private toastr:ToastrService,private router:Router) {

    this.satesOptions = states;

    cities.forEach(e => {
      this.citiesOptions.push(e.city_name_en);
    });

  }


  ngOnInit(): void {

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartData = cart;
    ////
    this.cartServices.CartNumber.subscribe(res => {
      this.cartNumber = res;
    });
    ////
    cart.forEach((e: any) => {
      this.totalOrder += e.subTotal;
    });
    this.totalOrder = this.totalOrder + 60;
    ////
    this.intializeForm();

    ////
    this.citiesControl.disable();

    this.satesFilteredOptions = this.statesControl.valueChanges.pipe(
      startWith(''),
      map(value => this._statesFilter(value || '')),

    );

    this.citiesFilteredOptions = this.citiesControl.valueChanges.pipe(
      startWith(''),
      map(value => this._citiessFilter(value || '')),
    );

  }

  private _statesFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.satesOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _citiessFilter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.citiesOptions?.filter(option => option.toLowerCase().includes(filterValue));
  }

  onSelectState(stateName: any) {
    if (stateName) {
      this.citiesControl.enable();

      let stateCity = cities.filter(city => city.big_city === stateName);

      this.citiesOptions = [];
      stateCity.forEach(e => {
        this.citiesOptions.push(e.city_name_en);
      });

      this.citiesControl.setValue('');
    }
  }

  onTypeState(e: any) {
    if (!e.value) {
      this.citiesControl.setValue('');
      this.citiesControl.disable();
    }
  }

  intializeForm() {
    this.formOrder = this.FB.group(
      {
        name: [null, Validators.required],
        email: [null, [Validators.required, this.emailValidation()]],
        state: [null, Validators.required],
        city: [null, Validators.required],
        street: [null, Validators.required],
        phone: [null, Validators.required],
      }
    )

  }

  emailValidation(): ValidatorFn {
    return ((control: AbstractControl): ValidationErrors | null => {

      let email = control.value;
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

      if (!emailPattern.test(email)) {
        return { invalidEmail: true };
      }
      else {
        return null;
      }

    })

  }

  onConfirm() {
    this.formOrder.get('state')?.patchValue(this.statesControl.value);
    this.formOrder.get('city')?.patchValue(this.citiesControl.value);

    if (this.formOrder.invalid) {
      this.formOrder.markAllAsTouched()
      this.statesControl.markAllAsTouched()
      this.citiesControl.markAllAsTouched()
    }
    else {

      let cartItems:OrderItems[]=[];

      this.cartData.forEach(e => {
        const item: OrderItems = {
          productId: e.productId,
          subTotal: e.subTotal,
          quantity: e.quantity
        };
      
        cartItems.push(item); 
      });

      let order:Order = 
      {
        name: this.formOrder.get('name')?.value,
        email: this.formOrder.get('email')?.value,
        state: this.formOrder.get('state')?.value,
        city: this.formOrder.get('city')?.value,
        street:this.formOrder.get('street')?.value,
        phone:this.formOrder.get('phone')?.value,
        total:this.totalOrder,
        items: cartItems
      }

      console.log(order);
      this.userServices.placeOrder(order).subscribe((res:any)=>
        {
          this.toastr.success(res.message)
          localStorage.removeItem('cart');
          this.cartServices.CartNumber.next(0)
          this.router.navigate(['/ordersuccess'])
        })
    }

  }

  onBack() {
    history.back();
  }





}
