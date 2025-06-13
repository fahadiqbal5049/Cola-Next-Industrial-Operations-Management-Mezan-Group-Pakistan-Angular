import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { SidbarLayoutComponent } from "./layouts/sidbar-layout/sidbar-layout.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderService } from './shared/services/loader.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidbarLayoutComponent, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ProductionAndTracking';

  showSidebar: boolean = true;
  loading!: Observable<boolean>;
  constructor(private router: Router, private loaderService: LoaderService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateSidebarVisibility();
    });
    this.loading = this.loaderService.loading$;
    console.log(this.loading)

  }
  ngOnInit(): void {
    this.loading.subscribe(() => {
      this.ngZone.run(() => {
        this.cdr.detectChanges();  // Ensure change detection runs in Angular's zone
      });
    });
  }
  private updateSidebarVisibility(): void {
    const currentRoute = this.router.url;
    // console.log(currentRoute)
    if (currentRoute.includes('dashboard')) {
      this.showSidebar = false;
    } else if (currentRoute.includes('login-form')) {
      this.showSidebar = false;
    } else if (currentRoute == '/') {
      this.showSidebar = false;
    } else {
      this.showSidebar = true;
    }
  }
}
