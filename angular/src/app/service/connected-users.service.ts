import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';

export interface ConnectedUser {
  id: number;
  username: string;
  email: string;
  location: {
    latitude: number;
    longitude: number;
  };
  lastActive: Date;
  isOnline: boolean;
  blockStatus?: {
    isBlocked: boolean;
    blockedUntil?: Date;
    blockType?: 'week' | 'month' | 'indefinite';
  };
}

@Injectable({
  providedIn: 'root'
})
export class ConnectedUsersService {
  private connectedUsers = new BehaviorSubject<ConnectedUser[]>([]);

  constructor() {}

  // Get geolocation using browser API
  getGeolocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position),
          (error) => reject(error),
          { enableHighAccuracy: true }
        );
      }
    });
  }

  // Block a user
  blockUser(userId: number, blockType: 'week' | 'month' | 'indefinite'): void {
    const currentUsers = this.connectedUsers.value;
    const userIndex = currentUsers.findIndex(user => user.id === userId);
    
    if (userIndex > -1) {
      let blockedUntil: Date | undefined;
      
      switch (blockType) {
        case 'week':
          blockedUntil = new Date();
          blockedUntil.setDate(blockedUntil.getDate() + 7);
          break;
        case 'month':
          blockedUntil = new Date();
          blockedUntil.setMonth(blockedUntil.getMonth() + 1);
          break;
        case 'indefinite':
          blockedUntil = undefined;
          break;
      }

      currentUsers[userIndex] = {
        ...currentUsers[userIndex],
        isOnline: false,
        blockStatus: {
          isBlocked: true,
          blockedUntil,
          blockType
        }
      };

      this.connectedUsers.next(currentUsers);
    }
  }

  // Unblock a user
  unblockUser(userId: number): void {
    const currentUsers = this.connectedUsers.value;
    const userIndex = currentUsers.findIndex(user => user.id === userId);
    
    if (userIndex > -1) {
      currentUsers[userIndex] = {
        ...currentUsers[userIndex],
        blockStatus: {
          isBlocked: false
        }
      };

      this.connectedUsers.next(currentUsers);
    }
  }

  // Check if user is blocked
  isUserBlocked(userId: number): boolean {
    const user = this.connectedUsers.value.find(u => u.id === userId);
    if (!user?.blockStatus?.isBlocked) return false;
    
    if (user.blockStatus.blockedUntil) {
      return new Date() < new Date(user.blockStatus.blockedUntil);
    }
    
    return true; // For indefinite blocks
  }

  // Update user connection status and location
  async updateUserStatus(userId: number, isOnline: boolean) {
    if (this.isUserBlocked(userId)) {
      console.log('User is blocked and cannot connect');
      return;
    }

    try {
      const position = await this.getGeolocation();
      const currentUsers = this.connectedUsers.value;
      const userIndex = currentUsers.findIndex(user => user.id === userId);
      
      if (userIndex > -1) {
        currentUsers[userIndex] = {
          ...currentUsers[userIndex],
          isOnline,
          lastActive: new Date(),
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
        };
        this.connectedUsers.next(currentUsers);
      }
    } catch (error) {
      console.error('Error getting geolocation:', error);
    }
  }

  // Get all connected users
  getConnectedUsers(): Observable<ConnectedUser[]> {
    return this.connectedUsers.asObservable();
  }

  // Add new connected user
  async addConnectedUser(user: Partial<ConnectedUser>) {
    if (this.isUserBlocked(user.id!)) {
      console.log('User is blocked and cannot be added');
      return;
    }

    try {
      const position = await this.getGeolocation();
      const currentUsers = this.connectedUsers.value;
      
      if (!currentUsers.find(u => u.id === user.id)) {
        const newUser: ConnectedUser = {
          ...user as ConnectedUser,
          location: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          lastActive: new Date(),
          isOnline: true,
          blockStatus: {
            isBlocked: false
          }
        };
        this.connectedUsers.next([...currentUsers, newUser]);
      }
    } catch (error) {
      console.error('Error getting geolocation:', error);
    }
  }

  // Remove disconnected user
  removeConnectedUser(userId: number) {
    const currentUsers = this.connectedUsers.value;
    this.connectedUsers.next(currentUsers.filter(user => user.id !== userId));
  }
}
