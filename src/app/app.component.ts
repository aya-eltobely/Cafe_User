import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./layouts/navbar/navbar.component";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FooterComponent } from "./layouts/footer/footer.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, NavbarComponent, CommonModule, FooterComponent]
})
export class AppComponent {

  title = 'UserSite';
  constructor(private router:Router) {
    
  }


  isloggview!:any;
  isLoggedView()
  {
   this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
    this.isloggview = (event.url == '/login' || event.url == '/register')  
    })
    return this.isloggview;
  }
  
}
