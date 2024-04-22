import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import { AccountService } from '../../core/services/account.service';
import { ToastrService } from 'ngx-toastr';
import {MatIconModule} from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule,MatButtonModule,MatIconModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  passhide = true;
  confpasshide = true;
  registerForm!:FormGroup;


  constructor(private FB:FormBuilder , private accountService:AccountService,private toaster:ToastrService,private router:Router){}


  ngOnInit(): void {
    this.intialiazeRegisterForm()
  }

  intialiazeRegisterForm()
  {
    this.registerForm = this.FB.group( 
      {
        firstName : [null , Validators.required],
        lastName : [null , Validators.required],
        email : [null ,[Validators.required , this.emailValidation()]],
        userName : [null , Validators.required],
        password : [null , [Validators.required ,  Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")] ] ,
        confirmPassword : [null , [Validators.required ,  Validators.pattern("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")] ],
        phoneNumber : [null , Validators.required],
      },
      { validators : [this.ConfirmPassFn() ] }
     )
  }


  emailValidation():ValidatorFn
  {
    return ( (control:AbstractControl) : ValidationErrors | null =>
    {
      
      let email = control.value;
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

      if (!emailPattern.test(email)) {
        return { invalidEmail: true };
      }
      else 
      {
        return null;
      } 

    } )

  }

  ConfirmPassFn():ValidatorFn
  {
    return ( (control:AbstractControl) : ValidationErrors | null =>
    {
      let pass = control.get('password')?.value;
      let confirmPass = control.get('confirmPassword')?.value;

      if(pass != confirmPass)
      {
        return { isNotMatch : true }
      }
      else
      {
        return null;
      }
    } )

  }


  submitRegisterForm()
  {
    if(this.registerForm.invalid)
    {
      this.registerForm.markAllAsTouched()
    }
    else
    {
      console.log(this.registerForm.value);
      this.accountService.register(this.registerForm.value).subscribe( res => 
        {
          this.toaster.success(res.message);
          this.router.navigate(['/login'])

        } );

      
    }
  }


}
