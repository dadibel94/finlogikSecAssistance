import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserActivity {
  userId: number;
  timestamp: Date;
  action: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface UserActivityLog {
  userId: number;
  username: string;
  activities: UserActivity[];
}

@Injectable({
  providedIn: 'root'
})
export class UserActivityService {
  private userLogs = new BehaviorSubject<UserActivityLog[]>([]);

  constructor() {}

  // Log a new activity for a user
  logActivity(userId: number, username: string, action: string, details: string) {
    const currentLogs = this.userLogs.value;
    const userLog = currentLogs.find(log => log.userId === userId);
    
    const newActivity: UserActivity = {
      userId,
      timestamp: new Date(),
      action,
      details,
      userAgent: navigator.userAgent
    };

    if (userLog) {
      userLog.activities.unshift(newActivity); // Add to beginning of array
      if (userLog.activities.length > 100) {
        userLog.activities.pop(); // Keep only last 100 activities
      }
    } else {
      currentLogs.push({
        userId,
        username,
        activities: [newActivity]
      });
    }

    this.userLogs.next(currentLogs);
  }

  // Get all logs for a specific user
  getUserLogs(userId: number): Observable<UserActivityLog | undefined> {
    return new Observable(subscriber => {
      this.userLogs.subscribe(logs => {
        subscriber.next(logs.find(log => log.userId === userId));
      });
    });
  }

  // Get all user logs
  getAllLogs(): Observable<UserActivityLog[]> {
    return this.userLogs.asObservable();
  }

  // Clear logs for a user
  clearUserLogs(userId: number) {
    const currentLogs = this.userLogs.value;
    const userLogIndex = currentLogs.findIndex(log => log.userId === userId);
    
    if (userLogIndex > -1) {
      currentLogs[userLogIndex].activities = [];
      this.userLogs.next(currentLogs);
    }
  }

  // Get activity description
  getActivityDescription(action: string): string {
    switch (action) {
      case 'LOGIN':
        return 'Logged in to the system';
      case 'LOGOUT':
        return 'Logged out of the system';
      case 'CODE_EDIT':
        return 'Modified code';
      case 'FILE_ACCESS':
        return 'Accessed a file';
      case 'PROFILE_UPDATE':
        return 'Updated profile information';
      default:
        return action;
    }
  }
}
