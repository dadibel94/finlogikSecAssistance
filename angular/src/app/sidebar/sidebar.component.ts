import { Component, OnInit } from '@angular/core';
import { JwtService } from '../service/jwt.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  userRole: string | null = null;

  constructor(private jwtService: JwtService) {}

  ngOnInit(): void {
    const userData = this.jwtService.getUserData();
    if (userData) {
      this.userRole = userData.role;
    }
  }

  isLoggedIn(): boolean {
    return this.jwtService.isAuthenticated();
  }
}
