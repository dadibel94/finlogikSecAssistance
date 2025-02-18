import { Component, OnInit } from '@angular/core';
import { ConnectedUsersService, ConnectedUser } from '../../service/connected-users.service';
import { JwtService } from '../../service/jwt.service';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-toututulisateurs',
  templateUrl: './toututulisateurs.component.html',
  styleUrls: ['./toututulisateurs.component.scss']
})
export class ToututulisateursComponent implements OnInit {
  connectedUsers: ConnectedUser[] = [];
  isSuperAdmin = false;
  geolocationError: string | null = null;
  selectedUser: ConnectedUser | null = null;
  blockDuration: 'week' | 'month' | 'indefinite' = 'week';
  ip: string = '';

  constructor(
    private connectedUsersService: ConnectedUsersService,
    private jwtService: JwtService
  ) {}

  ngOnInit() {
    // Check if current user is super admin
    this.isSuperAdmin = this.jwtService.getUserData()?.role.includes('superadmin');

    // get Current IP address and assign it to ip variable
    this.jwtService.getIp().subscribe(data => {
      this.ip = data.ip
    });

    if (this.isSuperAdmin) {
      // Subscribe to connected users updates
      this.connectedUsersService.getConnectedUsers().subscribe(users => {
        this.connectedUsers = users;
      });

      // Add current user with geolocation
      const currentUser = this.jwtService.getUserData();
      if (currentUser) {
        this.connectedUsersService.addConnectedUser({
          id: currentUser.id,
          username: currentUser.username,
          email: currentUser.email
        }).catch(error => {
          this.geolocationError = 'Please enable location services to use this feature.';
          console.error('Geolocation error:', error);
        });
      }
    }
  }

  // Format last active time
  formatLastActive(date: Date): string {
    return new Date(date).toLocaleString();
  }

  // Get status class for user
  getUserStatusClass(user: ConnectedUser): string {
    if (user.blockStatus?.isBlocked) return 'blocked';
    return user.isOnline ? 'online' : 'offline';
  }

  // Get Google Maps link for location
  getMapLink(latitude: number, longitude: number): string {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }

  // Block user
  blockUser(user: ConnectedUser) {
    this.connectedUsersService.blockUser(user.id, this.blockDuration);
  }

  // Unblock user
  unblockUser(user: ConnectedUser) {
    this.connectedUsersService.unblockUser(user.id);
  }

  // Get block status text
  getBlockStatusText(user: ConnectedUser): string {
    if (!user.blockStatus?.isBlocked) return '';
    
    if (user.blockStatus.blockedUntil) {
      const until = new Date(user.blockStatus.blockedUntil);
      return `Blocked until ${until.toLocaleDateString()}`;
    }
    
    return 'Blocked indefinitely';
  }

  // Open block modal
  openBlockModal(user: ConnectedUser) {
    this.selectedUser = user;
  }

  // Close block modal
  closeBlockModal() {
    this.selectedUser = null;
    this.blockDuration = 'week';
  }
}
