import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./modules/login/login.component').then((x) => x.LoginComponent),
        title: 'LogIn'
    },
    {
        path: 'register',
        loadComponent: () => import('./modules/register/register.component').then((x) => x.RegisterComponent),
        title: 'Register'
    }
    ,
    {
        path: '',
        loadComponent: () => import('./modules/admin/components/home/home.component').then((x) => x.HomeComponent),
        title: 'Home'
    }
    ,
    {
        path: 'productsView',
        loadComponent: () => import('./modules/admin/components/products-view/products-view.component').then((x) => x.ProductsViewComponent),
        data: {
            title: 'Your Title Here' // Specify your title here
        }
    },
    {
        path: 'cart',
        loadComponent: () => import('./modules/admin/components/cart/cart.component').then((x) => x.CartComponent),
        title: 'Cart' 
    },
    {
        path: 'payment',
        loadComponent: () => import('./modules/admin/components/payment/payment.component').then((x) => x.PaymentComponent),
        title: 'Payment' ,
        canActivate: [authGuard]
    },
    {
        path: 'ordersuccess',
        loadComponent: () => import('./modules/admin/components/order-success/order-success.component').then((x) => x.OrderSuccessComponent),
        title: 'Success' ,
        canActivate: [authGuard]
    },
    {
        path: 'orders',
        loadComponent: () => import('./modules/admin/components/orders/orders.component').then((x) => x.OrdersComponent),
        title: 'Orders' ,
        canActivate: [authGuard]
    },
    {
        path: ':categoryName',
        loadComponent: () => import('./modules/admin/components/sub-categories/sub-categories.component').then((x) => x.SubCategoriesComponent),
        data: {
            title: 'Your Title Here' // Specify your title here
        }
    },
   
   

];
