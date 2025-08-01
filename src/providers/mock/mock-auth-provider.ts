import { AuthProvider, User, UserRole } from '../types';

/**
 * Mock Authentication Provider
 * 
 * This is a simple mock implementation for development and testing.
 * Developers can replace this with their own authentication provider.
 */
export class MockAuthProvider implements AuthProvider {
  private currentUser: User | null = null;
  private users: Map<string, User> = new Map();

  constructor() {
    // Initialize with some mock users
    this.users.set('1', {
      id: '1',
      email: 'candidate@example.com',
      fullName: 'John Doe',
      role: UserRole.CANDIDATE,
      linkedinId: 'linkedin-123',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.users.set('2', {
      id: '2',
      email: 'admin@example.com',
      fullName: 'Admin User',
      role: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    this.users.set('3', {
      id: '3',
      email: 'referee@example.com',
      fullName: 'Jane Smith',
      role: UserRole.REFEREE,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  async authenticate(credentials: any): Promise<User> {
    // Mock authentication - just return the first user for demo
    const user = this.users.get('1');
    if (!user) {
      throw new Error('Authentication failed');
    }
    
    this.currentUser = user;
    return user;
  }

  async verifyToken(token: string): Promise<User | null> {
    // Mock token verification
    if (token === 'valid-token') {
      return this.users.get('1') || null;
    }
    return null;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }

  async isAuthenticated(): Promise<boolean> {
    return this.currentUser !== null;
  }

  getAuthUrl(provider: string): string {
    // Mock OAuth URL
    return `/auth/${provider}?mock=true`;
  }

  // Mock-specific methods for testing
  setCurrentUser(user: User | null) {
    this.currentUser = user;
  }

  addUser(user: User) {
    this.users.set(user.id, user);
  }

  removeUser(userId: string) {
    this.users.delete(userId);
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }
} 