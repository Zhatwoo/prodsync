'use client';

import { useAuth } from '../../../contexts/AuthContext';
import AuthForm from '../../../components/AuthForm';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SignInPage() {
  const { signIn, loading, error, clearError, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (data) => {
    clearError();
    const result = await signIn(data.email, data.password);
    
    if (result.success) {
      router.push('/dashboard');
    }
    
    return result;
  };

  return (
    <AuthForm
      mode="signin"
      onSubmit={handleSubmit}
      loading={loading}
      error={error}
    />
  );
}
