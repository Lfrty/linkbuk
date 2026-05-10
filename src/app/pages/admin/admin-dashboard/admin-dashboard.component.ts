import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-dashboard',
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent {

  private router = inject(Router);

  protected gestionUsuarios() {
    this.router.navigate(['/admin/usuarios']);
  }

}
