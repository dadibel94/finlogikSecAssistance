import { Component, OnInit } from '@angular/core';
import { JwtService } from '../../service/jwt.service';
import { QuestionService } from '../../service/questions.service'; // Import the QuestionService

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.scss']
})
export class GroupManagementComponent implements OnInit {
  groups: any[] = []; // Replace QuestionGroup with any or a specific interface if available
  availableUsers: any[] = []; // Replace User with any or a specific interface if available
  isSuperAdmin = false;
  newGroup = {
    nomGroup: '',
    description: '',
    utilisateurs: [],
  reponses: []
  };
  selectedGroup: any = null; // Replace QuestionGroup with any or a specific interface if available
  newMember = {
    id: 0,
    email: '',
    username: ''
  };
  searchTerm = '';
  errorMessage = '';
  groupQuestions: any[] = []; // To store questions for the selected group

  constructor(
    private jwtService: JwtService,
    private questionService: QuestionService // Use only QuestionService
  ) {}

  ngOnInit() {
    const userData = this.jwtService.getUserData();
    this.isSuperAdmin = userData?.role.includes('superadmin') || false;

    if (this.isSuperAdmin) {
      // Load groups
      this.loadGroups();

      // Load available users from API
      this.loadAvailableUsers();
    }
  }

  // Load all groups
  loadGroups() {
    this.questionService.getAllGroupQuestions().subscribe({
      next: (groups) => {
        this.groups = groups;
      },
      error: (error) => {
        console.error('Error loading groups:', error);
        this.errorMessage = 'Failed to load groups. Please try again later.';
      }
    });
  }

  // Load available users
  loadAvailableUsers() {
    // Assuming you have a method in QuestionService to fetch users
    this.questionService.getAllUsers().subscribe({
      next: (users) => {
        console.info('Available users:', users);
        this.availableUsers = users as any[];
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Failed to load users. Please try again later.';
      }
    });
  }

  // Create a new group
  createGroup() {
    if (!this.newGroup.nomGroup.trim()) return;

    const userData = this.jwtService.getUserData();
    if (!userData) return;

    console.log('New group:', this.newGroup);

    this.questionService.createGroupQuestion(this.newGroup).subscribe({
      next: (group) => {
        
        this.groups.push(group); // Add the new group to the list
        this.newGroup = { nomGroup: '', description: '',    utilisateurs: [],
          reponses: [] }; // Reset the form
      },
      error: (error) => {
        console.error('Error creating group:', error);
        this.errorMessage = 'Failed to create group. Please try again later.';
      }
    });
  }

  // Select a group
  selectGroup(group: any) {
    this.selectedGroup = group;
    this.newMember = { id: 0, email: '', username: '' };
    this.loadGroupQuestions(group.id); // Load questions for the selected group
  }

  // Load questions for the selected group
  loadGroupQuestions(groupId: number) {
    this.questionService.getAllGroupQuestions().subscribe({
      next: (questions) => {
        // Filter questions for the selected group (assuming questions have a groupId property)
        this.groupQuestions = questions.filter((q) => q.groupId === groupId);
      },
      error: (error) => {
        console.error('Error loading questions:', error);
        this.errorMessage = 'Failed to load questions. Please try again later.';
      }
    });
  }

  // Add a member to the selected group
  addMember() {
    if (!this.selectedGroup || !this.newMember.id) return;

    const user = this.availableUsers.find(u => u.id === this.newMember.id);
    if (!user) return;

    this.questionService.addUserToGroup(this.selectedGroup.id, user.id).subscribe({
      next: (group) => {
        this.selectedGroup = group; // Update the selected group with the new member
        this.newMember = { id: 0, email: '', username: '' }; // Reset the form
      },
      error: (error) => {
        console.error('Error adding member:', error);
        this.errorMessage = 'Failed to add member. Please try again later.';
      }
    });
  }

  // Remove a member from the selected group
  removeMember(groupId: number, memberId: number) {
    // Assuming you have a method in QuestionService to remove a member
    // this.questionService.removeMemberFromGroup(groupId, memberId).subscribe({
    //   next: () => {
    //     if (this.selectedGroup) {
    //       this.selectedGroup.members = this.selectedGroup.members.filter((m: any) => m.id !== memberId); // Remove the member from the selected group
    //     }
    //   },
    //   error: (error) => {
    //     console.error('Error removing member:', error);
    //     this.errorMessage = 'Failed to remove member. Please try again later.';
    //   }
    // });
  }

  // Delete a group
  deleteGroup(groupId: number) {
    if (confirm('Are you sure you want to delete this group?')) {
      this.questionService.deleteGroupQuestion(groupId).subscribe({
        next: () => {
          this.groups = this.groups.filter(g => g.id !== groupId); // Remove the group from the list
          this.selectedGroup = null; // Clear the selected group
        },
        error: (error) => {
          console.error('Error deleting group:', error);
          this.errorMessage = 'Failed to delete group. Please try again later.';
        }
      });
    }
  }

  // Update a group
  updateGroup() {
    if (!this.selectedGroup) return;

    this.questionService.updateGroupQuestion(this.selectedGroup.id, this.selectedGroup).subscribe({
      next: (updatedGroup) => {
        const index = this.groups.findIndex(g => g.id === updatedGroup.id);
        if (index !== -1) {
          this.groups[index] = updatedGroup; // Update the group in the list
        }
      },
      error: (error) => {
        console.error('Error updating group:', error);
        this.errorMessage = 'Failed to update group. Please try again later.';
      }
    });
  }

  // Filter members
  filterMembers(members: any[]): any[] {
    if (!this.searchTerm.trim()) return members;

    const search = this.searchTerm.toLowerCase();
    return members.filter(member => 
      member.username.toLowerCase().includes(search) ||
      member.email.toLowerCase().includes(search)
    );
  }

  // Filter available users
  filterAvailableUsers(): any[] {
    if (!this.searchTerm.trim()) return this.availableUsers;

    const search = this.searchTerm.toLowerCase();
    return this.availableUsers.filter(user => 
      user.username.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)
    );
  }

  // Add a new question to the selected group
  addQuestionToGroup(questionData: any) {
    if (!this.selectedGroup) return;

    this.questionService.createGroupQuestion(questionData).subscribe({
      next: (question) => {
        this.groupQuestions.push(question); // Add the new question to the list
      },
      error: (error) => {
        console.error('Error creating question:', error);
        this.errorMessage = 'Failed to create question. Please try again later.';
      }
    });
  }

  // Delete a question from the selected group
  deleteQuestionFromGroup(questionId: number) {
    this.questionService.deleteGroupQuestion(questionId).subscribe({
      next: () => {
        this.groupQuestions = this.groupQuestions.filter(q => q.id !== questionId); // Remove the question from the list
      },
      error: (error) => {
        console.error('Error deleting question:', error);
        this.errorMessage = 'Failed to delete question. Please try again later.';
      }
    });
  }
}