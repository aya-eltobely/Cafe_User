import { ChangeDetectionStrategy, Component, numberAttribute, OnInit, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { UserService } from '../../core/services/user.service';
import { Category } from '../../shared/Models/category';
import { Title } from '@angular/platform-browser';
import { CartService } from '../../core/services/cart.service';
import { Cart } from '../../shared/Models/cart';
import { AccountService } from '../../core/services/account.service';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatMenuModule, MatIconModule, MatButtonModule, CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnInit {

  // islogged:boolean=false ;
  userName!: any;
  allCategories!: Category[];
  cartNumber!: number;

  constructor(private router: Router, private userService: UserService, private title: Title, private cartService: CartService, protected accountServices: AccountService) {
  }

  ngOnInit(): void {

    if (localStorage.getItem('token')) {
      // this.islogged.set(true)
      this.accountServices.islogged.next(true)
    }
    else {
      // this.islogged.set(false)      
      this.accountServices.islogged.next(false)
    }


    this.accountServices.islogged.subscribe(res => {
      console.log(res);
      if (res) {
        const token: any = localStorage.getItem('token');

        const decodedToken = jwtDecode(token) as { [key: string]: string | number };
        this.userName = decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

      }

    })



    this.getCategories();

    this.getCartNumber()

  }

  getCategories() {
    this.userService.getCategories().subscribe((res: any) => {
      this.allCategories = res;
    })
  }


  onNavigate(categoryName: string, id: number) {
    this.router.navigate([`/${categoryName.toLowerCase()}`], { queryParams: { id: id, name: categoryName } });
  }


  getCartNumber() {
    this.cartService.CartNumber.subscribe(res => {
      this.cartNumber = res;
    })

  }

  onOrderHistory()
  {
    this.router.navigate(['/orders'])
  }

  onlogout() {
    localStorage.removeItem('token')
    this.accountServices.islogged.next(false)
    this.router.navigate(['/login'])
  }


}
