import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { User } from '../../shared/models/user.model';
import { Router } from '@angular/router';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
constructor(private authService:AuthService,private router:Router){}

bindingForm = new FormGroup(
  {
    email:new FormControl(null,Validators.required),
    password:new FormControl(null,Validators.required)
  }
)
  onSubmit(e: any) {
    e.preventDefault();
    // const { email, password } = this.formData;
    // this.loading = true;

    this.authService.logIn(this.bindingForm.value.email!, this.bindingForm.value.password!).subscribe(
      (data: any) => {
        notify("Logged In Successfully", "success")
        const tokenInfo: User = jwtDecode(data['token']);
        this.authService.user = new User();
        this.authService.user = tokenInfo;
        this.authService.user.USER_EMAIL = this.bindingForm.value.email;
        sessionStorage.setItem('UserInfo', JSON.stringify(this.authService.user));
        sessionStorage.setItem('userToken', data['token']);
        this.navigateToHome();
      },
      (complete: any) => {
        // this.loading = false;
      }


    )
  }

  navigateToHome() {
    this.router.navigate(['users'], { replaceUrl: true });

  }

}
