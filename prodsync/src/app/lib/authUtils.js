import { signOut } from 'firebase/auth';
import { auth } from './firebaseClient';

export const logout = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: error.message };
  }
};
