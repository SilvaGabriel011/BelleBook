import * as admin from 'firebase-admin';

export class AuthService {
  private auth: admin.auth.Auth;
  private db: admin.firestore.Firestore;

  constructor() {
    this.auth = admin.auth();
    this.db = admin.firestore();
  }

  async createUser(email: string, displayName?: string): Promise<admin.auth.UserRecord> {
    try {
      const userRecord = await this.auth.createUser({
        email,
        displayName,
      });

      await this.db.collection('users').doc(userRecord.uid).set({
        email,
        displayName,
        role: 'customer',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return userRecord;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async getUserById(uid: string): Promise<admin.firestore.DocumentSnapshot> {
    return this.db.collection('users').doc(uid).get();
  }

  async verifyToken(token: string): Promise<admin.auth.DecodedIdToken> {
    return this.auth.verifyIdToken(token);
  }
}

export default new AuthService();
