import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { GlobalService } from '../../shared/services/global.service';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import notify from 'devextreme/ui/notify';
import { ItemsList } from '@ng-select/ng-select/lib/items-list';

// export const collapse = [
// 	trigger('collapse', [
// 		state('init', style({ height: 0 })),
// 		state('off', style({ height: 0 })),
// 		state('on', style({ height: '*' })),
// 		transition('* => on', [animate('400ms cubic-bezier(.39,.8,.5,.95)')]),
// 		transition('on => off', [animate('400ms cubic-bezier(.39,.8,.5,.95)')]),
// 		transition('init => off', [animate('0s')])
// 	])
// ];

@Component({
	selector: 'app-menu',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './menu.component.html',
	styleUrl: './menu.component.scss',
	animations: [trigger('collapse', [
		state('init', style({ height: 0 })),
		state('off', style({ height: 0 })),
		state('on', style({ height: '*' })),
		transition('* => on', [animate('400ms cubic-bezier(.39,.8,.5,.95)')]),
		transition('on => off', [animate('400ms cubic-bezier(.39,.8,.5,.95)')]),
		transition('init => off', [animate('0s')])
	])],
})
export class MenuComponent {
	@Input() menuInfo: any;
	backitem: any = null;
	// authservice: any;
	// CheckData: any;
	// router: any;

	constructor(private authService: AuthService, private router: Router
	) { }
	selectedComponentTitle: any
	ngOnInit() {
		if (sessionStorage.getItem('selectedTabIndex') != null) {
			this.selectedTabIndex = parseInt(sessionStorage.getItem('selectedTabIndex')!.toString())
		}
		if (sessionStorage.getItem('selectedTab') != null) {
			this.selectedComponentTitle = JSON.parse(sessionStorage.getItem('selectedTab')!.toString()).title
		}
		if (sessionStorage.getItem('selectedModule') != null) {
			this.isToggleOn(JSON.parse(sessionStorage.getItem('selectedModule')!.toString()))
		}
		// console.log(sessionStorage.getItem('selectedTab'))
		// console.log(JSON.parse(sessionStorage.getItem('selectedTab')!.toString()))
		// this.selectTab(JSON.parse(sessionStorage.getItem('selectedTab')!.toString()),sessionStorage.getItem('selectedTabIndex'))
	}

	public isToggleOn(item: any) {
		if (this.backitem == item) {
			item.toggle === 'on' ? (item.toggle = 'off') : (item.toggle = 'on');
		} else if (this.backitem != null) {
			this.backitem.toggle = 'off';
		}

		if (this.backitem != item) {
			item.toggle === 'on' ? (item.toggle = 'off') : (item.toggle = 'on');
			this.backitem = item;
		}

		sessionStorage.setItem('selectedModule', JSON.stringify(item))
	}

	currentDpt(): string {
		if (this.authService.getDepartmentname() == 'Denim') {
			return 'Denim';
		}
		else {
			return 'Hosiery';
		}
	}

	checkIfShow(item: any): boolean {
		if (
			this.authService.getUserEmail() != 'augit@gmail.com' &&
			item.hideForCustomers &&
			item.hideForCustomers == true &&
			item.department == this.currentDpt()
		) {
			return false;
		}
		return true;
	}

	_selectItem(item: any, index: any) {
		// console.log(item,index)
		this.selectTab(item, index)
		// this._globalService.dataBusChanged('isActived', item);
	}

	selectedTabIndex: any
	selectTab(menu: any, i: any) {
		sessionStorage.setItem('selectedTabIndex', i)
		// menu.selected=true
		sessionStorage.setItem('selectedTab', JSON.stringify(menu))
		// var t =JSON.parse(sessionStorage.getItem('selectedTab')!.toString())
		// console.log(menu)


		this.authService.getSecurityDataForBlockedComponent(this.authService.getSecurityGroup(), menu.title).subscribe(
			(data: any) => {
				// console.log(data)

				var CheckData = data[0]['RESULT'];
				// var route=this.createFullPathe(menu.routerLink,i)
				console.log(CheckData)
				var route = menu.path
				if (CheckData > 0) {
					notify("You are not Allowed to access " + menu.title + " Component", "warning", 5000);
				}
				else {
					this.selectedTabIndex = null
					this.selectedTabIndex = i
					this.selectedComponentTitle = menu.title
					this.router.navigate([`${route}`])

				}
			}
		)
	}
	// temp: any
	// createFullPathe(path: any, index: number) {
	// 	// console.log(path)
	// 	var fullPath = ''
	// 	if (path.length == 4) {
	// 		fullPath = `${path[1]}${path[0]}${path[2]}${path[0]}${path[3]}`
	// 		this.temp = index
	// 	} else if (path.length == 3) {
	// 		fullPath = `${path[1]}${path[0]}${path[2]}`
	// 	}
	// 	else if (path.length == 2) {
	// 		fullPath = `${path[1]}`
	// 	}
	// 	// console.log(fullPath)

	// 	return fullPath
	// }
}


