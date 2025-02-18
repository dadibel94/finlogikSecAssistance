import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtService } from './jwt.service';

export interface QuestionGroup {
  id: number;
  name: string;
  description: string;
  members: GroupMember[];
  createdAt: Date;
  createdBy: number;
}

export interface GroupMember {
  id: number;
  username: string;
  email: string;
  joinedAt: Date;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionGroupService {
  private groups: QuestionGroup[] = [];
  private groupsSubject = new BehaviorSubject<QuestionGroup[]>([]);
  private apiUrl = 'http://localhost:8080/api';

  constructor(
    private http: HttpClient,
    private jwtService: JwtService
  ) {
    // Load groups from localStorage on init
    const savedGroups = localStorage.getItem('questionGroups');
    if (savedGroups) {
      this.groups = JSON.parse(savedGroups);
      this.groupsSubject.next(this.groups);
    }
  }

  // Get HTTP headers with JWT token
  private getHeaders(): HttpHeaders {
    const token = this.jwtService.getToken();

    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Get all available users from API
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getHeaders() });
  }

  // Get all groups
  getGroups(): Observable<QuestionGroup[]> {
    return this.groupsSubject.asObservable();
  }

  // Get groups for a specific user
  getUserGroups(userId: number): QuestionGroup[] {
    return this.groups.filter(group => 
      group.members.some(member => member.id === userId)
    );
  }

  // Create new group
  createGroup(name: string, description: string, createdBy: number): QuestionGroup {
    const newGroup: QuestionGroup = {
      id: Date.now(),
      name,
      description,
      members: [],
      createdAt: new Date(),
      createdBy
    };

    this.groups.push(newGroup);
    this.saveGroups();
    return newGroup;
  }

  // Add member to group
  addMemberToGroup(groupId: number, member: GroupMember): boolean {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) return false;

    if (group.members.some(m => m.id === member.id)) return false;

    group.members.push({
      ...member,
      joinedAt: new Date()
    });

    this.saveGroups();
    return true;
  }

  // Remove member from group
  removeMemberFromGroup(groupId: number, memberId: number): boolean {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) return false;

    const initialLength = group.members.length;
    group.members = group.members.filter(m => m.id !== memberId);

    if (group.members.length !== initialLength) {
      this.saveGroups();
      return true;
    }
    return false;
  }

  // Delete group
  deleteGroup(groupId: number): boolean {
    const initialLength = this.groups.length;
    this.groups = this.groups.filter(g => g.id !== groupId);

    if (this.groups.length !== initialLength) {
      this.saveGroups();
      return true;
    }
    return false;
  }

  // Update group
  updateGroup(groupId: number, name: string, description: string): boolean {
    const group = this.groups.find(g => g.id === groupId);
    if (!group) return false;

    group.name = name;
    group.description = description;
    this.saveGroups();
    return true;
  }

  // Save groups to localStorage
  private saveGroups(): void {
    localStorage.setItem('questionGroups', JSON.stringify(this.groups));
    this.groupsSubject.next(this.groups);
  }
}
