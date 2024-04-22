import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { AccountService } from '../../core/services/account.service';
import { NavigationEnd, Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,MatSelectModule,MatInputModule,MatFormFieldModule,MatIconModule,MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginForm!:FormGroup;
  hide = true;

  constructor(private FB:FormBuilder, private accService:AccountService,private router:Router,private tostr:ToastrService) {
    
  }


  ngOnInit(): void {
    this.intializeLoginForm();
  }

  intializeLoginForm()
  {
    this.loginForm = this.FB.group(
      {
        UserName: [null , [Validators.required]],
        Password : [null , [Validators.required] ]
      }
    )
  }


  submitForm()
  {
    if(this.loginForm.invalid)
    {
      this.loginForm.markAllAsTouched();
    }
    else
    {      
      this.accService.login(this.loginForm.value).subscribe( (res:any) => 
      {
        const decodedToken = jwtDecode(res.token) as { [key: string]: string | number };

        const role = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

        if(role == "User")
        {
          localStorage.setItem('token',res.token);
          this.loginForm.reset();
          this.router.navigate(['/'])
          this.accService.islogged.next(true);
        }
        else
        {
          this.tostr.error("Unauthorized");
        }
        
      });
      

    }

  }

  




}
