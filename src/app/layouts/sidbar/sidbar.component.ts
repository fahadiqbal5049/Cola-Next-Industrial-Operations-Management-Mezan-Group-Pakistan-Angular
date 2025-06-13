import { Component } from '@angular/core';
import { MenuComponent } from "../menu/menu.component";
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../shared/services/global.service';
// import { MenuService } from '../../shared/services/menu.service';
import { MENU_ITEM } from '../menu';
import { MenuService } from '../../shared/services/menu.service';

@Component({
	selector: 'app-sidbar',
	standalone: true,
	imports: [MenuComponent, CommonModule],
	templateUrl: './sidbar.component.html',
	styleUrl: './sidbar.component.scss'
})
export class SidbarComponent {
	avatarImgSrc = '../../assets/icons/mezanlogo.png';
	public menuInfo: Array<any> = [];
	public sidebarToggle = false;

	constructor(private _menuService: MenuService) { }

	ngOnInit() {
		this.menuInfo = this._menuService.putSidebarJson();
		// var selectedModule = JSON.parse(sessionStorage.getItem('selectedModule')!.toString())
		var isSelectdTabNull = sessionStorage.getItem('selectedTab')
		if (isSelectdTabNull != null) {
			var selectedTab = JSON.parse(isSelectdTabNull.toString())
			if (selectedTab != null) {
				this.menuInfo.forEach(item => {
					// if (item.title === selectedModule.title) {
					// 	item.toggle = 'on';
					// }
					item.children.forEach((element: any) => {
						if (element.title === selectedTab.title) {
							item.toggle = 'on';
						}
					});
				});
			}

		}

		// this.menuInfo = this.menuItem()
		// console.log(this.menuInfo)
		this._sidebarToggle();
		// this._menuService.selectItem(this.menuInfo);
		this._isSelectItem(this.menuInfo);
	}
	menuItem() {
		return MENU_ITEM
	}
	public _sidebarToggle() {
		// this._globalService._sidebarToggleState(true);
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
		// 	},
		// 	(error) => {
		// 		console.log('Error: ' + error);
		// 	}
		// );

		if (!this.sidebarToggle) {
			this.sidebarToggle = true
		}
		else {
			this.sidebarToggle = false
		}
		// this.sidebarToggle = !this.sidebarToggle
		// console.log(this.sidebarToggle)
	}
	_isSelectItem(item: any) {
		for (const i in item) {
			if (item[i].children) {
				for (const index in item[i].children) {
					if (item[i].children[index].isActive || item[i].children[index].toggle === 'on') {
						item[i].toggle = 'on';
						break;
					} else {
						this._isSelectItem(item[i].children);
					}
				}
			}
		}
	}
}
