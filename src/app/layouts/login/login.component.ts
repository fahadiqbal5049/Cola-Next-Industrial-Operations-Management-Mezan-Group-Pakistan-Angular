import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user.model';
import { AuthService } from '../../shared/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { DxFormModule, DxLoadIndicatorModule } from 'devextreme-angular';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [DxFormModule,DxLoadIndicatorModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  @Input()
  title!: string;

  @Input()
  description!: string;

  url!: "http://augit.tech/"


  //single card

  loading = false;
  formData: any = {};

  constructor(private authService: AuthService, private router: Router) { }
ngOnInit(): void {
  // this.authService.logIn('augit@gmail.com', '123').subscribe(
  //   (data: any) => {
  //     console.log(data)
  //     // notify("Logged In Successfully", "success")
  //     const tokenInfo: User = jwtDecode(data['token']);
  //     this.authService.user = new User();
  //     this.authService.user = tokenInfo;
  //     this.authService.user.USER_EMAIL = 'augit@gmail.com';
  //     sessionStorage.setItem('UserInfo', JSON.stringify(this.authService.user));
  //     sessionStorage.setItem('userToken', data['token']);
    
  //     // this.navigateToHome();
  //   },
  //   (complete: any) => {
  //     this.loading = false;
  //   }


  // )
}

  onSubmit(e: any) {
    e.preventDefault();
    const { email, password } = this.formData;
    this.loading = true;

    this.authService.logIn(email, password).subscribe(
      (data: any) => {
        // notify("Logged In Successfully", "success")
        const tokenInfo: User = jwtDecode(data['token']);
        this.authService.user = new User();
        this.authService.user = tokenInfo;
        this.authService.user.USER_EMAIL = email;
        sessionStorage.setItem('UserInfo', JSON.stringify(this.authService.user));
        sessionStorage.setItem('userToken', data['token']);
        // this.BreakdownService.getDataAgainstMachine()
        //   .subscribe(data => {
        //     console.log(data)
        //     sessionStorage.setItem('DataAgainstMachine', JSON.stringify(data));
        //   })
        // this.BreakdownService.getData().subscribe(data => {
        //   console.log(data)
        //   sessionStorage.setItem('Machines', JSON.stringify(data));
        // })
        // this.getTypes();
        this.navigateToHome();
      },
      (complete: any) => {
        this.loading = false;
      }


    )
  }

  navigateToHome() {
    this.router.navigate(['sku'], { replaceUrl: true });

  }

  onCreateAccountClick = () => {
    this.router.navigate(['/create-account']);
  }
  // getTypes() {
  //   this.BreakdownService.getTechnicians().subscribe((data: any) => {
  //     sessionStorage.setItem('Types', JSON.stringify(data.Table2));
  //   })
  // }
  // getDataAgainstMachine() {
  //   this.BreakdownService.getDataAgainstMachine()
  //     .subscribe(data => {
  //       console.log(data)
  //       sessionStorage.setItem('DataAgainstMachine', JSON.stringify(data));
  //     })
  // }
}
