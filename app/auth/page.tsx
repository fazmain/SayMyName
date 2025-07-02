'use client';

import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';

function AuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm />
    </Suspense>
  );
}

export default AuthPage;