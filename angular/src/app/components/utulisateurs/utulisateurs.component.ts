import { Component, OnInit } from '@angular/core';
import { ConnectedUsersService, ConnectedUser } from '../../service/connected-users.service';
import { UserActivityService, UserActivityLog, UserActivity } from '../../service/user-activity.service';
import { JwtService } from '../../service/jwt.service';

@Component({
  selector: 'app-utulisateurs',
  templateUrl: './utulisateurs.component.html',
  styleUrls: ['./utulisateurs.component.scss']
})
export class UtulisateursComponent implements OnInit {
  connectedUsers: ConnectedUser[] = [];
  userLogs: UserActivityLog[] = [];
  isAdmin = false;
  selectedUser: ConnectedUser | null = null;
  geolocationError: string | null = null;
  blockDuration: 'week' | 'month' | 'indefinite' = 'week';
  userToBlock: ConnectedUser | null = null;

  constructor(
    private connectedUsersService: ConnectedUsersService,
    private userActivityService: UserActivityService,
    private jwtService: JwtService
  ) {}

  ngOnInit() {
    // Check if current user is admin
    this.isAdmin = this.jwtService.getUserData()?.role.includes('admin');
    
    if (this.isAdmin) {
      // Subscribe to connected users updates
      this.connectedUsersService.getConnectedUsers().subscribe(users => {
        this.connectedUsers = users;
      });

      // Subscribe to user activity logs
      this.userActivityService.getAllLogs().subscribe(logs => {
        this.userLogs = logs;
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

  // Get user logs
  getUserLogs(userId: number): UserActivity[] {
    return this.userLogs.find(log => log.userId === userId)?.activities || [];
  }

  // Format timestamp
  formatTimestamp(date: Date): string {
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

  // View user activity logs
  viewUserLogs(user: ConnectedUser) {
    this.selectedUser = user;
  }

  // Close user logs modal
  closeUserLogs() {
    this.selectedUser = null;
  }

  // Clear user logs
  clearUserLogs(userId: number) {
    this.userActivityService.clearUserLogs(userId);
  }

  // Get activity icon
  getActivityIcon(action: string): string {
    switch (action) {
      case 'LOGIN':
        return '🔑';
      case 'LOGOUT':
        return '🚪';
      case 'CODE_EDIT':
        return '📝';
      case 'FILE_ACCESS':
        return '📁';
      case 'PROFILE_UPDATE':
        return '👤';
      default:
        return '📌';
    }
  }

  // Open block modal
  openBlockModal(user: ConnectedUser) {
    this.userToBlock = user;
  }

  // Close block modal
  closeBlockModal() {
    this.userToBlock = null;
    this.blockDuration = 'week';
  }

  // Block user
  blockUser(user: ConnectedUser) {
    this.connectedUsersService.blockUser(user.id, this.blockDuration);
    this.userActivityService.logActivity(
      user.id,
      user.username,
      'BLOCKED',
      `User blocked for ${this.blockDuration}`
    );
    this.closeBlockModal();
  }

  // Unblock user
  unblockUser(user: ConnectedUser) {
    this.connectedUsersService.unblockUser(user.id);
    this.userActivityService.logActivity(
      user.id,
      user.username,
      'UNBLOCKED',
      'User unblocked'
    );
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
}
