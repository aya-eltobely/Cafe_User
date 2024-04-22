import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { Product } from '../../../../shared/Models/product';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgxPaginationModule } from 'ngx-pagination';
import { EgyCurrencyPipe } from '../../../../shared/pipes/egy-currency.pipe';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { ProductsDetailsComponent } from '../products-details/products-details.component';
import { CartService } from '../../../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products-view',
  standalone: true,
  imports: [MatButtonModule,MatCardModule,MatIconModule,EgyCurrencyPipe,NgxPaginationModule],
  templateUrl: './products-view.component.html',
  styleUrl: './products-view.component.scss'
})
export class ProductsViewComponent implements OnInit {

  allProducts!:Product[];
  page: number = 1;
  totalItem!:number;
  titleName!: string;
  subcategoryId!: number;
 

  constructor(private userServices:UserService, private dialog: MatDialog,private route:ActivatedRoute,private title:Title,private cartService:CartService,private toastr:ToastrService) {

    
  }


  ngOnInit() {

    this.route.queryParams.subscribe( param => 
      {        
        this.titleName = param['name']
        this.title.setTitle(this.titleName);
        this.subcategoryId = param['id'];
      } );

    this.getAllProds()
  }

  getAllProds()
  {
    this.userServices.getProducts(this.subcategoryId,this.page,6,"").subscribe( (res:any) =>
      {
        this.totalItem = res.totalItem
        this.allProducts=res.data
      } )
  }


  viewProdct(id:number)
  {

    const dialogRef = this.dialog.open( ProductsDetailsComponent , {
      data:id,
      width:'900px',
      height:'auto'
  
    } );

    // dialogRef.afterClosed().subscribe( (res)=>
    // {
    //   //add data to db
    //   let cat:Category = {name:res}
      
    //   if(res)
    //   {
    //     this.catService.addcategory(cat).subscribe( (res:any) => 
    //     {
    //       this.toastr.success(res.message)
    //       this.getcategorylist()
    //     } )
    //   }
    // } )

  }


  onPageChange(event:any)
  {
    this.page =event;
    this.getAllProds();
    console.log(event);
    
  }


  addToCart(productId:number) {
    console.log(productId);
    
    const storedCart = localStorage.getItem('cart');

    let cart: any[] = storedCart ? JSON.parse(storedCart) : [];

    let product!:any;

    this.userServices.getProductById(productId).subscribe(res=>
      {
        console.log(res);
        
        product = res;


        const existingProductIndex = cart.findIndex(item => item.productId ===  product.id);

    if (existingProductIndex !== -1) { 
      cart[existingProductIndex].quantity += 1;
    } 
    else {
      cart.push({
        productId:  product.id,
        productName:  product.name,
        productPrice:  product.price,
        quantity: 1,
        subTotal:  1 *  product.price,
        contentType: product.contentType,
        imageData: product.imageData,
        fileName:product.fileName  
      }) 
    }
    localStorage.setItem('cart', JSON.stringify(cart));

    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    this.cartService.CartNumber.next(cartItems.length);

    this.toastr.success('Item added to cart')
    console.log(this.cartService.CartNumber.getValue()); 
      })

      

    
  }



}
