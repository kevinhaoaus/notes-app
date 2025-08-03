import { useAuthContext } from '../contexts/AuthContext';
import { registerUser, loginUser, logoutUser, resetPassword } from '../services/firebase/auth';
import { toast } from 'react-hot-toast';

export function useAuth() {
  const { user, loading, error, dispatch } = useAuthContext();

  const register = async (email, password, displayName) => {
    try {
      const result = await registerUser(email, password, displayName);
      
      if (result.success) {
        toast.success('Account created successfully! Please check your email for verification.');
        return { success: true };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const login = async (email, password) => {
    try {
      const result = await loginUser(email, password);
      
      if (result.success) {
        toast.success('Welcome back!');
        return { success: true };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      const result = await logoutUser();
      
      if (result.success) {
        toast.success('Logged out successfully');
        return { success: true };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        toast.success(result.message);
        return { success: true };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  return {
    user,
    loading,
    error,
    register,
    login,
    logout,
    forgotPassword,
    isAuthenticated: !!user
  };
}