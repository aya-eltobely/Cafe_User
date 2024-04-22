import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import { UserService } from '../../../../core/services/user.service';
import { OrderHistory } from '../../../../shared/Models/order-history';
import { CommonModule } from '@angular/common';
import {MatChipsModule} from '@angular/material/chips';
import { EgyCurrencyPipe } from '../../../../shared/pipes/egy-currency.pipe';
import {MatButtonModule} from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [MatTabsModule,MatIconModule,CommonModule,MatChipsModule, EgyCurrencyPipe,MatButtonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {

  currComporderHistory!: OrderHistory[];
  rejectedorderHistory!: OrderHistory[];

  constructor(private userServcice:UserService,private toastr:ToastrService) {    
  }

  ngOnInit(): void {
    this.getAllCurrentAndCompletedOrders();
    this.getAllRejectedOrders();
  }

  getAllCurrentAndCompletedOrders()
  {
    this.userServcice.getAllCurrentAndCompletedOrders().subscribe( (res:any) =>
      {
        this.currComporderHistory=res;        
      })
  }

  getAllRejectedOrders()
  {
    this.userServcice.getAllRejecteddOrders().subscribe( (res:any) =>
      {
        this.rejectedorderHistory=res;
      })
  }

  DeclineOrder(oredrid:number)
  {
    this.userServcice.declineOrder(oredrid).subscribe((res:any)=>
    {
      this.toastr.success(res.message);
      this.getAllCurrentAndCompletedOrders();
      this.getAllRejectedOrders()
    })
  }
}
