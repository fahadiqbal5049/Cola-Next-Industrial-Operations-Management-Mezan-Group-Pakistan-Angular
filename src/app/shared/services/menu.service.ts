import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MENU_ITEM } from '../../layouts/menu';
import { AuthService } from './auth.service';
import { GlobalService } from './global.service';

@Injectable({
	providedIn: 'root'
})
export class MenuService {
	employeeType: any;
	securityGroup: any;
	MENU_ITEM: Array<any> = [];
	USER_MAIL: any;
	constructor(public _globalService: GlobalService, private _router: Router, public authSer: AuthService) {
		this.USER_MAIL = this.authSer.getUserEmail()
		// if (this.USER_MAIL === 'augitsupport@gmail.com') {
		// 	this.getNodePath(AUGIT_MENU_ITEM)
		// } else {
		this.getNodePath(MENU_ITEM);
		// console.log('menu service')
		// }
		this.employeeType = authSer.employeeType();
		this.securityGroup = authSer.getSecurityGroup();
	}

	private parent_node = null;
	private node = null;
	private path_item: any;

	protected queryParentNode(json: any, node_id: any) {
		for (let i = 0; i < json.length; i++) {
			if (this.node) {
				break;
			}
			const object = json[i];
			if (!object || !object.path) {
				continue;
			}
			if (object.path === node_id) {
				this.node = object;
				break;
			} else {
				if (object.children) {
					this.parent_node = object;
					this.queryParentNode(object.children, node_id);
				} else {
					continue;
				}
			}
		}
		if (!this.node) {
			this.parent_node = null;
		}
		return {
			parent_node: this.parent_node,
			node: this.node
		};
	}

	protected creatRouterLink(nodeId: any): any {
		this.node = null;
		let menuObj: any = null;
		this.parent_node = null;
		menuObj = this.queryParentNode(MENU_ITEM, nodeId);
		if (menuObj.parent_node && menuObj.parent_node.path) {
			this.path_item.unshift(menuObj.parent_node.path);
			return this.creatRouterLink(menuObj.parent_node.path);
		} else {
			return this.path_item;
		}
	}

	protected getNodePath(json: any): void {
		json.forEach((index: any) => {
			if (index.children) {
				// delete index.routerLink;
				this.getNodePath(index.children);
				index.toggle = 'init';
			} else {
				this.path_item = [index.path];
				index.routerLink = this.creatRouterLink(index.path);
				if (index.afterPmConfiguration && index.afterPmConfiguration === true) {
					index.routerLink.unshift('/', 'pages/project-management');
				} else if (index.afterReportsConfiguration && index.afterReportsConfiguration === true) {
					index.routerLink.unshift('/', 'pages/utility');
				} else if (index.aftertagConfiguration && index.aftertagConfiguration === true) {
					index.routerLink.unshift('/', 'pages/tagging-system');
				} else if (index.independentModule && index.independentModule == true) {
					index.routerLink.unshift('/');
				} else {
					index.routerLink.unshift('/', 'pages');
				}
			}
		});
	}

	public putSidebarJson() {
		// this.autSer.getNavigation().subscribe((data: any) => {
		//   this.MENU_ITEM = data;
		// });
		// if (this.USER_MAIL === 'augitsupport@gmail.com') {

		// 	return AUGIT_MENU_ITEM;
		// }
		// else {
		return MENU_ITEM;
		// }
	}

	public selectItem(item: any[]) {
		item.forEach((element) => {
			if (element.routerLink) {
				element.isActive = this._router.isActive(this._router.createUrlTree(element.routerLink), true);
				if (element.isActive) {
					// this._globalService._isActived(element);
					this._globalService.dataBusChanged('isActived', element);
				}
				// console.log(element.routerLink);
			} else if (element.children) {
				this.selectItem(element.children);
			}
		});
	}
}
