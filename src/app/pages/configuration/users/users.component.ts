import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UsersService,
  UserModel,
} from '../../../shared/services/users.service';
import { SecurityGroupService } from '../../../shared/services/security-group.service';
import { NgForm } from '@angular/forms';
import notify from 'devextreme/ui/notify';
import { AuthService } from '../../../shared/services/auth.service';
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';
import {
  DxDataGridModule,
  DxDataGridTypes,
} from 'devextreme-angular/ui/data-grid';
import {
  DxPopupModule,
  DxFormModule,
  DxButtonModule,
} from 'devextreme-angular';
import { SecurityGroup } from '../../../shared/models/security-group.model';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [DxDataGridModule, DxPopupModule, DxFormModule, DxButtonModule],
})
export class UsersComponent implements OnInit {
  loading: any;
  passwordMode!: string;
  dataSource!: UserModel[];
  addPopUp: boolean = false;
  editPopUp: boolean = false;

  user: UserModel = new UserModel();

  groups!: SecurityGroup[];
  departments!: any[];

  // formData: any = {};
  formData: UserModel = new UserModel();

  subscriptions: Subscription[] = [];
  dtTrigger: Subject<any> = new Subject();

  @ViewChild('bindingform') bindingform!: NgForm;

  buttonOptions = {
    text: 'Submit',
    useSubmitBehavior: true,
  };

  constructor(
    private userService: UsersService,
    private groupService: SecurityGroupService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getData();
    this.getGroups();
    this.passwordMode = 'password';
  }

  onExporting(e: DxDataGridTypes.ExportingEvent) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Users');

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(
          new Blob([buffer], { type: 'application/octet-stream' }),
          'DataGrid.xlsx'
        );
      });
    });
  }

  getData() {
    this.subscriptions.push(
      this.userService.getData().subscribe(
        (data) => {
          console.log('Fetched data:', data);
          this.dataSource = data;
          this.dtTrigger.next(null);
        },
        (error) => {
          console.error('Error fetching data:', error);
          notify('Error fetching data', 'error');
        }
      )
    );
  }

  getGroups() {
    this.groupService.getData().subscribe(
      (data) => {
        this.groups = data;
      },
      (error) => {
        console.error('Error fetching groups:', error);
        notify('Error fetching groups', 'error');
      }
    );
  }

  resetForm() {
    // this.formData = {};
    this.formData = new UserModel();
  }

  onSubmit(e: any) {
    e.preventDefault();

    this.userService.addUser(this.formData).subscribe(
      (data) => {
        this.formData = new UserModel();
        this.resetForm();
        this.getData();
        notify('User added successfully', 'success');
        this.addPopUp = false;
      },
      (error) => {
        console.error('Error adding user:', error);
        notify('Error adding user', 'error');
      }
    );
  }

  onUpdate(e: any) {
    e.preventDefault();

    const updatedData: Partial<UserModel> = {
      SEQ_ID: Number(this.formData.SEQ_ID),
      AUG_SECURITY_GROUP_SEQ_ID: Number(
        this.formData.AUG_SECURITY_GROUP_SEQ_ID
      ),
      EMPLOYEE_NAME: this.formData.EMPLOYEE_NAME,
      USER_NAME: this.formData.USER_NAME,
      STATUS: this.formData.STATUS,
      USER_EMAIL: this.formData.USER_EMAIL,
      DESIGNATION: this.formData.DESIGNATION,
      ACTIVE: Number(this.formData.ACTIVE),
      MODIFIED_BY: Number(this.authService.getUserId()),
    };

    console.log('Updated Data:', updatedData);

    this.userService.updateUser(updatedData).subscribe(
      (data) => {
        this.formData = new UserModel();
        this.resetForm();
        this.getData();
        notify('User updated successfully', 'success');
        this.editPopUp = false;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  onEdit(e: any) {
    if (this.authService.getGroupName() === 'admin') {
      this.formData = Object.assign({}, e);
      this.editPopUp = true;
    } else {
      notify('You are not allowed to perform this operation!', 'warning');
    }
  }

  onDelete(e: any) {
    if (this.authService.getGroupName() === 'admin') {
      if (!confirm('Are you sure you want to delete this entry?')) return;

      this.userService.deleteUser(e.SEQ_ID).subscribe(
        (data) => {
          this.dataSource = this.dataSource.filter(
            (item) => item.SEQ_ID !== e.SEQ_ID
          );
          notify('User deleted successfully', 'success');
        },
        (error) => {
          console.error('Error deleting user:', error);
          notify('Error deleting user', 'error');
        }
      );
    } else {
      notify('You are not allowed to perform this operation!', 'warning');
    }
  }

  openAddForm() {
    if (this.authService.getGroupName() === 'admin') {
      this.resetForm();
      this.addPopUp = true;
    } else {
      notify('You are not allowed to perform this operation!', 'warning');
    }
  }
  // onActiveValueChanged(e: any) {
  //   if (this.formData) {
  //   this.formData.ACTIVE = e.value === 1;
  //   }
  // }
}
