import { Component } from '@angular/core';
import { SidbarComponent } from '../sidbar/sidbar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidbar-layout',
  standalone: true,
  imports: [SidbarComponent,TopbarComponent,RouterModule],
  templateUrl: './sidbar-layout.component.html',
  styleUrl: './sidbar-layout.component.scss'
})
export class SidbarLayoutComponent {

}
