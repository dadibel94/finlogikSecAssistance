import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface GroupQuestion {
  id: number;
  groupId: number;
  userId: number;
  username: string;
  title: string;
  content: string;
  createdAt: Date;
  answers: QuestionAnswer[];
}

export interface QuestionAnswer {
  id: number;
  userId: number;
  username: string;
  content: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class GroupQuestionService {
  private questions: GroupQuestion[] = [];
  private questionsSubject = new BehaviorSubject<GroupQuestion[]>([]);

  constructor() {
    // Load questions from localStorage on init
    const savedQuestions = localStorage.getItem('groupQuestions');
    if (savedQuestions) {
      this.questions = JSON.parse(savedQuestions);
      this.questionsSubject.next(this.questions);
    }
  }

  // Get all questions
  getQuestions(): Observable<GroupQuestion[]> {
    return this.questionsSubject.asObservable();
  }

  // Get questions for a specific group
  getGroupQuestions(groupId: number): GroupQuestion[] {
    return this.questions.filter(q => q.groupId === groupId);
  }

  // Create new question
  createQuestion(
    groupId: number,
    userId: number,
    username: string,
    title: string,
    content: string
  ): GroupQuestion {
    const newQuestion: GroupQuestion = {
      id: Date.now(),
      groupId,
      userId,
      username,
      title,
      content,
      createdAt: new Date(),
      answers: []
    };

    this.questions.push(newQuestion);
    this.saveQuestions();
    return newQuestion;
  }

  // Add answer to question
  addAnswer(
    questionId: number,
    userId: number,
    username: string,
    content: string
  ): boolean {
    const question = this.questions.find(q => q.id === questionId);
    if (!question) return false;

    const newAnswer: QuestionAnswer = {
      id: Date.now(),
      userId,
      username,
      content,
      createdAt: new Date()
    };

    question.answers.push(newAnswer);
    this.saveQuestions();
    return true;
  }

  // Delete question
  deleteQuestion(questionId: number): boolean {
    const initialLength = this.questions.length;
    this.questions = this.questions.filter(q => q.id !== questionId);

    if (this.questions.length !== initialLength) {
      this.saveQuestions();
      return true;
    }
    return false;
  }

  // Delete answer
  deleteAnswer(questionId: number, answerId: number): boolean {
    const question = this.questions.find(q => q.id === questionId);
    if (!question) return false;

    const initialLength = question.answers.length;
    question.answers = question.answers.filter(a => a.id !== answerId);

    if (question.answers.length !== initialLength) {
      this.saveQuestions();
      return true;
    }
    return false;
  }

  // Save questions to localStorage
  private saveQuestions(): void {
    localStorage.setItem('groupQuestions', JSON.stringify(this.questions));
    this.questionsSubject.next(this.questions);
  }
}
