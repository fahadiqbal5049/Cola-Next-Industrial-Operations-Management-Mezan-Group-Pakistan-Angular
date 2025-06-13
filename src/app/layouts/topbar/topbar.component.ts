import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { GlobalService } from '../../shared/services/global.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  avatarImgSrc = 'assets/images/SideLogo.png';
	userName = '';
	userSubName = '';
	userPost = 'Musician, Player';

	sidebarToggle = false;
	tip = { ring: true, email: true };

	@Output() myEvent = new EventEmitter();

	constructor( public authService: AuthService) {}

	ngOnInit() {
		// if ( this.authService.getCompanyLogo() !== '') {
		//  this.avatarImgSrc = environment.baseUrl + '/' + this.authService.getCompanyLogo();
		// }
		this.userSubName = this.authService.currentSubUserName();
		this.userName = this.authService.getUserName();
	}

	// getUserName() {
	// 	if (this.userName === '') {
	// 		this.SignOut();
	// 	} else {
	// 		// const type = this.authService.employeeType();
	// 		return this.userSubName; // + ' (' + type + ')';
	// 	}
	// }
	getName() {
		return this.userName;
	}

	getUserType() {
		return this.authService.employeeType();
	}
	getUserEmail() {
		return this.authService.getUserEmail();
	}
	public _sidebarToggle() {
		/* this._globalService.sidebarToggle$.subscribe(sidebarToggle => {
      this.sidebarToggle = sidebarToggle;
    }, error => {
      console.log('Error: ' + error);
    }); */

		// this._globalService.data$.subscribe(
		// 	(data) => {
		// 		if (data.ev === 'sidebarToggle') {
		// 			this.sidebarToggle = data.value;
		// 		}
		// 		// tslint:disable-next-line: no-shadowed-variable
		// 	},
		// 	(error) => {
		// 		console.log('Error: ' + error);
		// 	}
		// );
		// this._globalService.dataBusChanged('sidebarToggle', !this.sidebarToggle);
		if (!this.sidebarToggle){
			this.sidebarToggle = true
		}
		else {
			this.sidebarToggle = false
		}
		this.myEvent.emit(null)

		// this._globalService._sidebarToggleState(!this.sidebarToggle);
	}
	SignOut() {
		this.authService.logOut();
	}
}
