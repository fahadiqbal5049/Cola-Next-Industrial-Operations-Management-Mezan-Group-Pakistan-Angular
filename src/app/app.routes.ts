import { Routes } from '@angular/router';
import { LoginComponent } from './layouts/login/login.component';
import { CategoryComponent } from './pages/configuration/category/category.component';
import { PageAuthorizationComponent } from './pages/configuration/page-authorization/page-authorization.component';
import { SkuDetailsComponent } from './pages/configuration/sku-details/sku-details.component';
import { SkuComponent } from './pages/configuration/sku/sku.component';
import { SecurityGroupComponent } from './pages/configuration/security-group/security-group.component';
import { UsersComponent } from './pages/configuration/users/users.component';
import { SecurityComponent } from './pages/configuration/security/security.component';
import { PlannedProductionComponent } from './pages/ProductionTracking/planned-production/planned-production.component';
import { LoginFormComponent } from './layouts/login-form/login-form.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ProductionPlanComponent } from './pages/ProductionTracking/production-plan/production-plan.component';
import { UnitsComponent } from './pages/configuration/units/units.component';
import { StocksComponent } from './pages/configuration/stocks/stocks.component';
import { ShiftdetailsComponent } from './pages/configuration/shiftdetails/shiftdetails.component';
import { MachinesComponent } from './pages/configuration/machines/machines.component';
import { MachineCapacityComponent } from './pages/configuration/machine-capacity/machine-capacity.component';
import { SkuRecipeComponent } from './pages/configuration/sku-recipe/sku-recipe.component';
import { MaterialsComponent } from './pages/configuration/materials/materials.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login-form', pathMatch: 'full' },
    // { path: '**', redirectTo: 'login-form' },

    {
        path: 'login-form',
        component: LoginFormComponent
    },
    {
        path: 'security-groups',
        canActivate: [AuthGuard],
        component: SecurityGroupComponent
    },
    {
        path: 'users',
        canActivate: [AuthGuard],
        component: UsersComponent
    },
    {
        path: 'security-component',
        canActivate: [AuthGuard],
        component: SecurityComponent
    },
    {
        path: 'units',
        canActivate: [AuthGuard],
        component: UnitsComponent
    },
    {
        path: 'page-authorization',
        canActivate: [AuthGuard],
        component: PageAuthorizationComponent
    },
    {
        path: 'categories',
        canActivate: [AuthGuard],
        component: CategoryComponent
    },
    {
        path: 'sku',
        canActivate: [AuthGuard],
        component: SkuComponent
    },
    {
        path: 'sku-details',
        canActivate: [AuthGuard],
        component: SkuDetailsComponent
    },
    {
      path: 'sku-recipe',
      canActivate: [AuthGuard],
      component: SkuRecipeComponent
  },
  {
    path: 'materials',
    canActivate: [AuthGuard],
    component: MaterialsComponent
},
    {
      path: 'stocks',
      canActivate: [AuthGuard],
      component: StocksComponent
  },
  {
    path: 'shiftsdetails',
    canActivate: [AuthGuard],
    component: ShiftdetailsComponent
},
{
  path: 'machines',
  canActivate: [AuthGuard],
  component: MachinesComponent
},
{
  path: 'machinecapacity',
  canActivate: [AuthGuard],
  component: MachineCapacityComponent
},



    {
        path: 'planned-production',
        canActivate: [AuthGuard],
        component: PlannedProductionComponent
    },
    {
        path: 'production-plan',
        canActivate: [AuthGuard],
        component: ProductionPlanComponent
    },

];
