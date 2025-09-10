'use client';

import { useAuth } from '../../../contexts/AuthContext';
import AuthForm from '../../../components/AuthForm';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignUpPage() {
  const { signUp, loading, error, clearError, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (data) => {
    clearError();
    const result = await signUp(data);
    
    if (result.success) {
      router.push('/dashboard');
    }
    
    return result;
  };

  return (
    <AuthForm
      mode="signup"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}
